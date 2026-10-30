'use client';
import { useState } from 'react';
import { PageHead, StateBox, fmt } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';
import { callAdmin, friendlyError } from '@/services/adminApi';
import { useAdminSession } from '@/services/session';
import { downloadText } from '@/services/download';

export default function UsersPage() {
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const { data, error, loading, reload } = useAdminData<any>('list_users', { search, status: status || undefined, limit: 25, offset: page * 25 });
  const [target, setTarget] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { role } = useAdminSession();
  const [detail, setDetail] = useState<any>(null);
  const [detailErr, setDetailErr] = useState<string | null>(null);
  const openDetail = async (id: string) => {
    setDetail({ loading: true }); setDetailErr(null);
    try { setDetail((await callAdmin<any>('get_user', { userId: id })).user); } catch (e) { setDetail(null); setDetailErr(friendlyError(e)); }
  };
  const verify = async (decision: 'approved' | 'rejected') => {
    try { await callAdmin('review_verification', { userId: detail.id, decision }); await openDetail(detail.id); } catch (e) { setDetailErr(friendlyError(e)); }
  };
  const exportCsv = async () => {
    try { const r = await callAdmin<any>('export_users'); downloadText(`chahat-users-${new Date().toISOString().slice(0, 10)}.csv`, r.csv); } catch (e) { setDetailErr(friendlyError(e)); }
  };

  const act = async () => {
    if (!target) return;
    setBusy(true); setMsg(null);
    try {
      await callAdmin('set_user_status', { userId: target.id, status: target.status === 'active' ? 'suspended' : 'active', reason });
      setTarget(null); setReason(''); reload();
    } catch (e) { setMsg(friendlyError(e)); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <PageHead title="Users" subtitle="View, verify, suspend or restore members. Chats, email and phone are never shown. Opening a profile is recorded in the audit log."
        action={role === 'admin' ? <button onClick={exportCsv} className="px-4 py-2 rounded-xl border text-sm font-bold">Export CSV</button> : undefined} />
      {detailErr && <p role="alert" className="text-xs text-rose-700">{detailErr}</p>}
      <form onSubmit={(e) => { e.preventDefault(); setPage(0); setSearch(q); }} className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name" aria-label="Search by name" className="px-3 py-2 rounded-xl border border-slate-300 text-sm flex-1 min-w-[200px]" />
        <select value={status} onChange={(e) => { setPage(0); setStatus(e.target.value); }} aria-label="Status filter" className="px-3 py-2 rounded-xl border border-slate-300 text-sm">
          <option value="">All statuses</option><option value="active">Active</option><option value="suspended">Suspended</option>
        </select>
        <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold">Search</button>
      </form>
      <StateBox loading={loading} error={error} empty={!!data && data.users.length === 0} emptyText="No users match." />
      {data && data.users.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-left text-slate-500 uppercase tracking-wider"><tr>{['Name', 'City', 'Age', 'Status', 'Plan', 'Open reports', 'Last active', ''].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {data.users.map((u: any) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{u.name || '—'}{u.isDemo && <span className="ml-2 text-[10px] text-slate-400">demo</span>}</td>
                  <td className="px-4 py-3">{u.city || '—'}</td><td className="px-4 py-3">{u.age ?? '—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full font-bold ${u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{u.status}</span></td>
                  <td className="px-4 py-3">{u.subscription ? `${u.subscription.tier} (${u.subscription.status})` : 'free'}</td>
                  <td className="px-4 py-3">{u.openReports}</td><td className="px-4 py-3">{fmt(u.lastActive)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap"><button onClick={() => openDetail(u.id)} className="font-bold hover:underline mr-3">View</button>{!u.isDemo && <button onClick={() => { setTarget(u); setReason(''); setMsg(null); }} className="font-bold text-rose-700 hover:underline">{u.status === 'active' ? 'Suspend' : 'Restore'}</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs">
            <span>{data.total} total</span>
            <span className="space-x-2">
              <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded-lg border disabled:opacity-40">Prev</button>
              <button disabled={(page + 1) * 25 >= data.total} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded-lg border disabled:opacity-40">Next</button>
            </span>
          </div>
        </div>
      )}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl space-y-3 text-sm">
            {detail.loading ? <p className="text-xs text-slate-500">Loading…</p> : (
              <>
                <div className="flex justify-between items-start gap-3">
                  <div><h2 className="font-extrabold text-lg">{detail.name || '—'}, {detail.age ?? '—'}</h2>
                    <div className="text-xs text-slate-500">{detail.city || '—'} · {detail.gender || '—'} looking for {detail.seeking || '—'} · joined {fmt(detail.createdAt)} · last active {fmt(detail.lastActive)}</div></div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${detail.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{detail.status}</span>
                </div>
                {detail.photos?.length > 0 && <div className="flex gap-2 overflow-x-auto">{detail.photos.map((u: string) => <img key={u} src={u} alt="" className="w-28 h-36 object-cover rounded-xl border" />)}</div>}
                {detail.bio && <p className="p-3 bg-slate-50 rounded-xl text-xs">{detail.bio}</p>}
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <div><b>Work:</b> {detail.work || '—'}</div><div><b>Education:</b> {detail.education || '—'}</div>
                  <div><b>Interests:</b> {(detail.interests ?? []).join(', ') || '—'}</div><div><b>Languages:</b> {(detail.languages ?? []).join(', ') || '—'}</div>
                  <div><b>Plan:</b> {detail.subscription ? `${detail.subscription.tier} (${detail.subscription.status}) until ${fmt(detail.subscription.expires_at)}` : 'free'}</div>
                  <div><b>Matches:</b> {detail.matchCount} · <b>Reports filed:</b> {detail.reportsFiled}</div>
                  <div><b>Selfie verification:</b> {detail.verification}</div>
                </div>
                {detail.verification === 'pending' && (
                  <div className="flex gap-2"><button onClick={() => verify('approved')} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">Approve verification</button>
                    <button onClick={() => verify('rejected')} className="px-3 py-1.5 rounded-xl border text-xs font-bold">Reject</button></div>
                )}
                {detail.verification === 'approved' && <button onClick={() => verify('rejected')} className="text-xs font-bold text-rose-700 hover:underline">Remove verified badge</button>}
                <div><div className="font-bold text-xs mb-1">Reports against this member ({detail.reportsAgainst.length})</div>
                  {detail.reportsAgainst.length === 0 ? <p className="text-xs text-slate-500">None.</p> :
                    <ul className="space-y-1 text-xs">{detail.reportsAgainst.map((r: any) => <li key={r.id} className="p-2 bg-slate-50 rounded-lg"><b>{r.category}</b> · {r.source} · {r.status} · {fmt(r.created_at)}{r.note ? ` — ${r.note}` : ''}</li>)}</ul>}</div>
                <div className="flex justify-end gap-2">
                  {!detail.isDemo && <button onClick={() => { setTarget({ id: detail.id, name: detail.name, status: detail.status }); setReason(''); setMsg(null); setDetail(null); }} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold">{detail.status === 'active' ? 'Suspend' : 'Restore'}</button>}
                  <button onClick={() => setDetail(null)} className="px-4 py-2 rounded-xl border text-sm font-bold">Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {target && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
            <h2 className="font-extrabold">{target.status === 'active' ? 'Suspend' : 'Restore'} {target.name || 'this user'}?</h2>
            <p className="text-xs text-slate-600">{target.status === 'active' ? 'The member will see a “suspended” screen, will be hidden from Discover, and cannot like, message or call. ' : ''}This action is recorded in the audit log with your identity.</p>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} maxLength={400} rows={3} placeholder="Reason (required)" className="w-full p-2 rounded-xl border border-slate-300 text-sm" />
            {msg && <p role="alert" className="text-xs text-rose-700">{msg}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setTarget(null)} className="px-4 py-2 rounded-xl border text-sm font-bold">Cancel</button>
              <button disabled={busy || reason.trim().length < 3} onClick={act} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold disabled:opacity-50">{busy ? 'Working…' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
