'use client';
import { useState } from 'react';
import { PageHead, StateBox, fmt } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';
import { callAdmin, friendlyError } from '@/services/adminApi';

export default function NotificationsPage() {
  const { data, error, loading, reload } = useAdminData<any>('list_announcements');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [segment, setSegment] = useState({ gender: '', city: '', plan: '' });
  const [audience, setAudience] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const check = async () => {
    setBusy(true); setMsg(null);
    try { setAudience((await callAdmin<any>('send_announcement', { title: title || 'x', body: body || 'x', segment, dryRun: true })).recipients); }
    catch (e) { setMsg(friendlyError(e)); } finally { setBusy(false); }
  };
  const send = async () => {
    if (!confirm(`Send “${title}” to ${audience ?? 'all matching'} phones now? This cannot be undone.`)) return;
    setBusy(true); setMsg(null);
    try {
      const r = await callAdmin<any>('send_announcement', { title, body, segment });
      setMsg(`Sent to ${r.sent} of ${r.recipients} phones${r.failed ? ` (${r.failed} failed)` : ''}.`);
      setTitle(''); setBody(''); setAudience(null); reload();
    } catch (e) { setMsg(friendlyError(e)); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <PageHead title="Notifications" subtitle="Send an update or offer as a push notification. Only members who allow “Offers & announcements” (Settings → Notifications, on by default) receive it. Suspended and incomplete accounts never do." />
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-sm max-w-2xl">
        <label className="block"><span className="text-xs font-bold text-slate-600">Title ({title.length}/60)</span>
          <input value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300" /></label>
        <label className="block"><span className="text-xs font-bold text-slate-600">Message ({body.length}/200)</span>
          <textarea value={body} maxLength={200} rows={3} onChange={(e) => setBody(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300" /></label>
        <div className="grid sm:grid-cols-3 gap-3">
          <select value={segment.gender} onChange={(e) => { setAudience(null); setSegment({ ...segment, gender: e.target.value }); }} aria-label="Gender" className="px-3 py-2 rounded-xl border border-slate-300">
            <option value="">All genders</option><option value="man">Men</option><option value="woman">Women</option></select>
          <select value={segment.plan} onChange={(e) => { setAudience(null); setSegment({ ...segment, plan: e.target.value }); }} aria-label="Plan" className="px-3 py-2 rounded-xl border border-slate-300">
            <option value="">All plans</option><option value="free">Free members</option><option value="paid">Paid members</option></select>
          <input value={segment.city} onChange={(e) => { setAudience(null); setSegment({ ...segment, city: e.target.value }); }} placeholder="City (optional)" className="px-3 py-2 rounded-xl border border-slate-300" />
        </div>
        <p className="text-[11px] text-slate-500">Keep it honest and relevant. No dark patterns, fake urgency, or personal data in the text.</p>
        {msg && <p role="status" className="text-xs font-semibold">{msg}</p>}
        <div className="flex gap-2">
          <button disabled={busy} onClick={check} className="px-4 py-2 rounded-xl border font-bold disabled:opacity-50">Check audience{audience !== null ? `: ${audience} phones` : ''}</button>
          <button disabled={busy || !title.trim() || !body.trim()} onClick={send} className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold disabled:opacity-50">{busy ? 'Working…' : 'Send now'}</button>
        </div>
      </div>
      <h2 className="font-extrabold">History</h2>
      <StateBox loading={loading} error={error} empty={!!data && data.announcements.length === 0} emptyText="Nothing sent yet." />
      <div className="space-y-2">
        {data?.announcements.map((a: any) => (
          <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-4 text-xs">
            <div className="font-bold text-sm">{a.title}</div><div className="text-slate-600">{a.body}</div>
            <div className="text-slate-500 mt-1">{fmt(a.created_at)} · audience {JSON.stringify(a.segment) === '{}' ? 'everyone' : Object.entries(a.segment).map(([k, v]) => `${k}: ${v}`).join(', ')} · sent {a.sent}/{a.recipients}{a.failed ? ` · failed ${a.failed}` : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
