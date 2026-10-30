'use client';
import { useState } from 'react';
import { PageHead, StateBox, short } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';
import { callAdmin, friendlyError } from '@/services/adminApi';

export default function StaffPage() {
  const { data, error, loading, reload } = useAdminData<any>('list_staff');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const setMod = async (em: string, grant: boolean) => {
    if (!grant && !confirm(`Remove moderator access from ${em}?`)) return;
    setBusy(true); setMsg(null);
    try { await callAdmin('set_moderator', { email: em, grant }); setEmail(''); setMsg(grant ? 'Moderator added.' : 'Moderator removed.'); reload(); }
    catch (e) { setMsg(friendlyError(e)); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <PageHead title="Staff & Roles" subtitle="Moderators can view users, handle reports and suspend accounts. Admins also manage ads, notifications, payments, reports and staff. You can add or remove moderators here; admin access can only be granted in the database, so a stolen session can never create new admins." />
      <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setMod(email.trim(), true); }} className="flex flex-wrap gap-2 text-sm">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email of an existing Chahat account" aria-label="Moderator email" className="px-3 py-2 rounded-xl border border-slate-300 flex-1 min-w-[240px]" />
        <button disabled={busy || !email.trim()} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-50">Add moderator</button>
      </form>
      {msg && <p role="status" className="text-xs font-semibold">{msg}</p>}
      <StateBox loading={loading} error={error} empty={!!data && data.staff.length === 0} />
      {data && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-sm">
          {data.staff.map((s: any) => (
            <div key={`${s.userId}-${s.role}`} className="px-4 py-3 flex items-center justify-between gap-3">
              <span>{s.email ?? short(s.userId)}</span>
              <span className="flex items-center gap-3">
                <span className="uppercase text-xs font-extrabold text-rose-700">{s.role}</span>
                {s.role === 'moderator' && s.email && <button disabled={busy} onClick={() => setMod(s.email, false)} className="text-xs font-bold text-slate-500 hover:underline">Remove</button>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
