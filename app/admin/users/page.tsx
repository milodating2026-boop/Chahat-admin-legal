'use client';
import { useState } from 'react';
import { PageHead, StateBox, fmt } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';
import { callAdmin, friendlyError } from '@/services/adminApi';

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
      <PageHead title="Users" subtitle="Profiles from the app database. Email, phone, chats and photos are intentionally not shown here." />
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
                  <td className="px-4 py-3 text-right">{!u.isDemo && <button onClick={() => { setTarget(u); setReason(''); setMsg(null); }} className="font-bold text-rose-700 hover:underline">{u.status === 'active' ? 'Suspend' : 'Restore'}</button>}</td>
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
      {target && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
            <h2 className="font-extrabold">{target.status === 'active' ? 'Suspend' : 'Restore'} {target.name || 'this user'}?</h2>
            <p className="text-xs text-slate-600">{target.status === 'active' ? 'The member will be unable to send messages. ' : ''}This action is recorded in the audit log with your identity.</p>
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
