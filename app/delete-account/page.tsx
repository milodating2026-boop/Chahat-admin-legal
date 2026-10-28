'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';
import { supabase } from '@/services/supabase';
import { SUPPORT_EMAIL } from '@/lib/contact';
import {
  friendlySendCodeError, friendlyVerifyError, friendlyOAuthReturnError, friendlyRequestError, successMessage,
  type RequestResult,
} from '@/lib/accountErrors';

// Google sign-in stays hidden unless explicitly enabled (needs the Google provider + this page's URL allowed in Supabase Auth).
const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_SIGNIN === 'true';

type Phase = 'email' | 'code' | 'confirm' | 'working' | 'done';

export default function DeleteAccountPage() {
  const [phase, setPhase] = useState<Phase>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [typed, setTyped] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [result, setResult] = useState<RequestResult>(null);
  const submitting = React.useRef(false);

  // Resume when a session already exists (returning from Google, or a page refresh), and surface OAuth errors.
  React.useEffect(() => {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const oauthErr = url.searchParams.get('error_description') || url.searchParams.get('error') || hash.get('error_description') || hash.get('error');
    if (oauthErr) setErr(friendlyOAuthReturnError(oauthErr));
    supabase?.auth.getSession().then(({ data }) => {
      if (data.session) { setEmail(data.session.user.email ?? ''); setPhase((p) => (p === 'email' || p === 'code' ? 'confirm' : p)); }
    });
    const sub = supabase?.auth.onAuthStateChange((evt, session) => {
      if (evt === 'SIGNED_IN' && session) { setEmail(session.user.email ?? ''); setPhase((p) => (p === 'email' || p === 'code' ? 'confirm' : p)); }
    });
    return () => sub?.data.subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Never creates accounts. The reply is deliberately the same whether or not the e-mail has an account.
  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy || cooldown > 0) return;
    setErr(''); setBusy(true);
    const { error } = await supabase!.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: false } });
    setBusy(false);
    const noAccount = error && /signups? not allowed|otp_disabled|user not found/i.test(`${(error as any).code ?? ''} ${error.message}`);
    if (error && !noAccount) { setErr(friendlySendCodeError(error)); return; }
    setCooldown(30); setCode(''); setPhase('code');
  };
  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setErr(''); setBusy(true);
    const { error } = await supabase!.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
    setBusy(false);
    if (error) { setErr(friendlyVerifyError(error)); return; }
    setCode(''); setPhase('confirm');
  };
  const google = async () => {
    setErr('');
    const { error } = await supabase!.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/delete-account` } });
    if (error) setErr(friendlyOAuthReturnError(null));
  };
  const del = async () => {
    if (submitting.current) return; // blocks double-clicks / duplicate submissions
    submitting.current = true;
    setErr(''); setPhase('working');
    const { data, error } = await supabase!.functions.invoke('request-account-deletion', { body: { confirm: true } });
    if (error || !data?.success) {
      submitting.current = false;
      const status = (error as { context?: { status?: number } } | null)?.context?.status;
      if (status === 401) { await supabase!.auth.signOut(); setPhase('email'); setErr(friendlyRequestError(error, 401)); return; }
      setPhase('confirm'); setErr(friendlyRequestError(error, status));
      return;
    }
    setResult(data);
    await supabase!.auth.signOut();
    setPhase('done');
  };
  const cancel = async () => { await supabase?.auth.signOut(); setTyped(''); setCode(''); setErr(''); setPhase('email'); };

  const card = 'bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 text-sm text-slate-700 dark:text-slate-300';
  const input = 'w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-950 text-sm';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <PublicHeader />
      <PageBanner badge="Your data" title="Delete Your Account" subtitle="Request permanent deletion of your Chahat account and data. We verify your email first so we know the account is yours." breadcrumbs={[{ label: 'Delete Account' }]} />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 space-y-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
          <p className="font-bold text-slate-900 dark:text-white">Chahat — Online Friendship App (com.chahat.dating)</p>
          <p><strong>Deleted:</strong> profile, photos and verification selfies, voice intro, matches, likes and blocks, messages and chat media (also removed for the other person), location data, push tokens and settings, consent and acceptance records, and your sign-in account.</p>
          <p><strong>Kept:</strong> reports made about or by you (identity replaced by a pseudonymous identifier, a hash of your account ID that is not anonymous; free-text notes may remain), payment records for subscriptions (detached from your account) and a pseudonymised record that a deletion occurred. We have not yet set fixed retention periods for these; see the <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.</p>
          <p>Deleting your account does not cancel a Google Play subscription. Cached image links can work for up to one hour. We have not verified whether our database host keeps backups containing deleted data for a limited period.</p>
        </div>
        {!supabase && <div role="alert" className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">Online deletion is not configured on this deployment. Email {SUPPORT_EMAIL} from the address on your account.</div>}

        {supabase && (phase === 'email' || phase === 'code') && (
          <div className={card}>
            {phase === 'email' ? (
              <form onSubmit={sendCode} className="space-y-4">
                <label className="block space-y-1"><span className="text-xs font-bold uppercase">Email</span><input className={input} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                <button disabled={busy} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-60">{busy ? 'Sending code…' : 'Email me a verification code'}</button>
              </form>
            ) : (
              <form onSubmit={verify} className="space-y-4">
                <p className="text-xs">If an account exists for <strong>{email}</strong>, we have emailed a verification code. Enter it below.</p>
                <label className="block space-y-1"><span className="text-xs font-bold uppercase">Verification code</span><input className={input} inputMode="numeric" autoComplete="one-time-code" required maxLength={10} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} /></label>
                <button disabled={busy || code.length < 6} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-60">{busy ? 'Verifying…' : 'Verify and continue'}</button>
                <div className="flex justify-between text-xs">
                  <button type="button" onClick={() => { setPhase('email'); setErr(''); }} className="underline">Use a different email</button>
                  <button type="button" onClick={() => sendCode()} disabled={busy || cooldown > 0} className="underline disabled:opacity-50 disabled:no-underline">{cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}</button>
                </div>
              </form>
            )}
            {GOOGLE_ENABLED && <button onClick={google} className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold">Continue with Google</button>}
            <p className="text-xs text-slate-500">Can&apos;t verify your email? Contact {SUPPORT_EMAIL} and we will help verify ownership. See the <Link href="/privacy-policy" className="underline">Privacy Policy</Link> for what is deleted and what is retained.</p>
          </div>
        )}

        {supabase && (phase === 'confirm' || phase === 'working') && (
          <div className={card}>
            <div className="flex items-start gap-2 text-rose-700"><Trash2 className="w-5 h-5 shrink-0" /><p className="font-bold">This is permanent and cannot be undone.</p></div>
            <ul className="list-disc pl-5 text-xs space-y-1">
              <li>Your profile, photos, selfies, matches, chats and chat media (also removed for the other person), location and sign-in account are deleted.</li>
              <li>Reports about or by you, payment records and a pseudonymised deletion record are kept in reduced form; see the Privacy Policy.</li>
              <li>Cancel any Google Play subscription separately in Google Play.</li>
            </ul>
            <p className="text-xs">Signed in as <strong>{email}</strong>. Type <strong>DELETE</strong> to confirm your request.</p>
            <input className={input} value={typed} onChange={(e) => setTyped(e.target.value)} aria-label="Type DELETE to confirm" autoComplete="off" />
            {err && <p role="alert" className="text-xs text-rose-700 flex gap-1.5"><AlertCircle className="w-4 h-4 shrink-0" />{err}</p>}
            <div className="flex gap-2">
              <button onClick={cancel} disabled={phase === 'working'} className="px-4 py-3 rounded-xl border font-bold">Cancel</button>
              <button onClick={del} disabled={typed !== 'DELETE' || phase === 'working'} className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold disabled:opacity-50">{phase === 'working' ? 'Submitting…' : 'Submit deletion request'}</button>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className={card} role="status">
            <div className="flex items-center gap-2 text-emerald-700 font-bold"><CheckCircle2 className="w-5 h-5" /> {successMessage(result).title}</div>
            <p className="text-xs">{successMessage(result).body}</p>
            <p className="text-xs">If you had a Google Play subscription, cancel it in Google Play so you are not billed again.</p>
          </div>
        )}
        {err && (phase === 'email' || phase === 'code') && <p role="alert" className="text-xs text-rose-700">{err}</p>}
        <p className="text-[11px] text-slate-500 flex gap-1.5"><ShieldCheck className="w-4 h-4 shrink-0" /> Requests are processed by the same secure server-side deletion as the in-app option; your identity comes from your verified sign-in only.</p>
      </main>
      <PublicFooter />
    </div>
  );
}
