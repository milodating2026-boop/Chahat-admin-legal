'use client';
import { useState } from 'react';
import { callAdmin, friendlyError } from '@/services/adminApi';
import { fmt } from '@/components/layout/AdminShell';

const TIERS = [
  { id: 'premium', label: 'Premium' },
  { id: 'plus', label: 'Plus' },
  { id: 'vip', label: 'VIP' },
] as const;
const DURATIONS = [7, 30, 60, 90, 180, 365];

type Sub = { tier: string; status: string; startsAt?: string; expiresAt?: string | null; grantedByStaff?: boolean } | null;

/** Admin-only: give any member Premium / Plus / VIP by email, or remove their plan. Every change is audited. */
export function GrantPlanCard({ onChanged }: { onChanged?: () => void }) {
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<'premium' | 'plus' | 'vip'>('premium');
  const [days, setDays] = useState(30);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [current, setCurrent] = useState<{ email: string; name: string | null; sub: Sub } | null>(null);

  const em = email.trim().toLowerCase();
  const isActive = (s: Sub) => !!s && s.status === 'active' && (!s.expiresAt || Date.parse(s.expiresAt) > Date.now());

  const lookup = async () => {
    if (!em) return;
    setBusy(true); setMsg(null);
    try {
      const r = await callAdmin('lookup_subscription', { email: em });
      setCurrent({ email: em, name: r.name, sub: r.subscription });
    } catch (e) { setCurrent(null); setMsg({ ok: false, text: friendlyError(e) }); }
    finally { setBusy(false); }
  };

  const submit = async (remove: boolean) => {
    if (!em) return setMsg({ ok: false, text: 'Enter the member\'s email address.' });
    if (reason.trim().length < 3) return setMsg({ ok: false, text: 'Add a reason (at least 3 characters), e.g. "Giveaway winner".' });
    const label = TIERS.find((t) => t.id === tier)!.label;
    const confirmText = remove
      ? `Remove the current plan from ${em}? Paid features stop immediately.`
      : `Give ${em} ${label} for ${days} days, starting now? This replaces any plan they have.`;
    if (!window.confirm(confirmText)) return;
    setBusy(true); setMsg(null);
    try {
      const r = await callAdmin('grant_subscription', remove ? { email: em, tier: 'free', reason } : { email: em, tier, days, reason });
      setCurrent({ email: em, name: current?.email === em ? current.name : null, sub: r.subscription });
      setMsg({ ok: true, text: remove ? 'Plan removed.' : `${label} is active until ${fmt(r.subscription.expiresAt)}.` });
      setReason('');
      onChanged?.();
    } catch (e) { setMsg({ ok: false, text: friendlyError(e) }); }
    finally { setBusy(false); }
  };

  const input = 'px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white';
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <div>
        <h2 className="font-extrabold">Give a plan</h2>
        <p className="text-xs text-slate-500 mt-1">Give any member Premium, Plus or VIP for free, by the email they signed up with. It starts now, replaces any current plan, does not renew, and is recorded in the audit log. The member sees it after reopening the app.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex gap-2">
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setCurrent(null); }} onBlur={lookup}
            placeholder="member@example.com" aria-label="Member email" className={`${input} flex-1`} />
          <button type="button" onClick={lookup} disabled={busy || !em} className="px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold disabled:opacity-50">Check</button>
        </div>
        <select value={tier} onChange={(e) => setTier(e.target.value as any)} aria-label="Plan" className={input}>
          {TIERS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Duration" className={input}>
          {DURATIONS.map((d) => <option key={d} value={d}>{d} days</option>)}
        </select>
      </div>
      <input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={400} placeholder="Reason (required), e.g. Giveaway winner, support compensation"
        aria-label="Reason" className={`${input} w-full`} />

      {current && current.email === em && (
        <div className="text-xs rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
          <b>{current.name || em}</b> — current plan:{' '}
          {isActive(current.sub)
            ? <><b className="uppercase">{current.sub!.tier}</b> until {fmt(current.sub!.expiresAt)}{current.sub!.grantedByStaff ? ' (given by staff)' : ' (bought on Google Play)'}</>
            : <b>Free</b>}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => submit(false)} disabled={busy}
          className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold disabled:opacity-50">{busy ? 'Working…' : 'Give plan'}</button>
        <button type="button" onClick={() => submit(true)} disabled={busy || !(current && current.email === em && isActive(current.sub))}
          className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 text-sm font-bold disabled:opacity-40">Remove plan</button>
      </div>
      {msg && <p className={`text-sm font-semibold ${msg.ok ? 'text-emerald-700' : 'text-rose-700'}`} role="status">{msg.text}</p>}
    </div>
  );
}
