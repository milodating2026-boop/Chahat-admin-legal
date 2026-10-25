'use client';
import { useState } from 'react';
import { PageHead, StateBox, fmt } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';
import { callAdmin, friendlyError } from '@/services/adminApi';

export default function ReportsPage() {
  const [status, setStatus] = useState('open');
  const { data, error, loading, reload } = useAdminData<any>('list_reports', { status, limit: 100 });
  const [sel, setSel] = useState<any>(null);
  const [note, setNote] = useState('');
  const [suspend, setSuspend] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const resolve = async (resolution: 'actioned' | 'dismissed') => {
    setBusy(true); setMsg(null);
    try {
      if (resolution === 'actioned' && suspend) await callAdmin('set_user_status', { userId: sel.target, status: 'suspended', reason: `Report ${sel.id}: ${note}` });
      await callAdmin('resolve_report', { reportId: sel.id, resolution, note });
      setSel(null); setNote(''); setSuspend(false); reload();
    } catch (e) { setMsg(friendlyError(e)); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <PageHead title="Reports & Moderation" subtitle="User reports from the app. Statuses mirror the database: open, actioned, dismissed. Appeals are not part of the current backend." />
      <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status" className="px-3 py-2 rounded-xl border border-slate-300 text-sm">
        <option value="open">Open</option><option value="actioned">Actioned</option><option value="dismissed">Dismissed</option><option value="">All</option>
      </select>
      <StateBox loading={loading} error={error} empty={!!data && data.reports.length === 0} emptyText="No reports." />
      <div className="space-y-3">
        {data?.reports.map((r: any) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4 text-xs space-y-1">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="font-bold text-sm">{r.targetName ?? 'Unknown member'} <span className="text-slate-400 font-normal">reported by {r.reporterName ?? 'unknown'}</span></span>
              <span className="uppercase font-bold text-rose-700">{r.status}</span>
            </div>
            <div>{r.category} · from {r.source} · {fmt(r.created_at)}</div>
            {r.note && <p className="p-2 bg-slate-50 rounded-lg">{r.note}</p>}
            {r.status === 'open' && <button onClick={() => { setSel(r); setNote(''); setMsg(null); }} className="font-bold text-rose-700 hover:underline">Review</button>}
          </div>
        ))}
      </div>
      {sel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
            <h2 className="font-extrabold">Resolve report</h2>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={400} rows={3} placeholder="Resolution note (required)" className="w-full p-2 rounded-xl border border-slate-300 text-sm" />
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={suspend} onChange={(e) => setSuspend(e.target.checked)} /> Also suspend the reported member</label>
            {msg && <p role="alert" className="text-xs text-rose-700">{msg}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setSel(null)} className="px-3 py-2 rounded-xl border text-sm font-bold">Cancel</button>
              <button disabled={busy || note.trim().length < 3} onClick={() => resolve('dismissed')} className="px-3 py-2 rounded-xl border text-sm font-bold disabled:opacity-50">Dismiss</button>
              <button disabled={busy || note.trim().length < 3} onClick={() => resolve('actioned')} className="px-3 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold disabled:opacity-50">Mark actioned</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
