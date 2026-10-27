'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';
import { supabase } from '@/services/supabase';
import { SUPPORT_EMAIL } from '@/lib/contact';

type Phase = 'signin' | 'confirm' | 'working' | 'done';

export default function DeleteAccountPage() {
  const [phase, setPhase] = useState<Phase>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [typed, setTyped] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  // On return from Google sign-in the session already exists; resume at the confirm step.
  React.useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => { if (data.session) { setEmail(data.session.user.email ?? ''); setPhase('confirm'); } });
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setErr('Sign-in failed. Check your email and password.'); return; }
    setPassword(''); setPhase('confirm');
  };
  const google = async () => {
    setErr('');
    const { error } = await supabase!.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/delete-account` } });
    if (error) setErr('Google sign-in is not available right now.');
  };
  const del = async () => {
    setErr(''); setPhase('working');
    const { data, error } = await supabase!.functions.invoke('delete-account', { body: { confirm: true } });
    if (error || !data?.success) {
      setPhase('confirm');
      setErr('Deletion did not finish. Your account is still signed in and may be suspended; press the button again to retry, or contact support.');
      return;
    }
    await supabase!.auth.signOut();
    setPhase('done');
  };
  const cancel = async () => { await supabase?.auth.signOut(); setTyped(''); setErr(''); setPhase('signin'); };

  const card = 'bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 text-sm text-slate-700 dark:text-slate-300';
  const input = 'w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-950 text-sm';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <PublicHeader />
      <PageBanner badge="Your data" title="Delete Your Account" subtitle="Permanently delete your Chahat account and data. You must sign in so we know the account is yours." breadcrumbs={[{ label: 'Delete Account' }]} />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 space-y-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
          <p className="font-bold text-slate-900 dark:text-white">Chahat — Online Friendship App (com.chahat.dating)</p>
          <p><strong>Deleted:</strong> profile, photos and verification selfies, voice intro, matches, likes and blocks, messages and chat media (also removed for the other person), location data, push tokens and settings, call records, coin balance, consent and acceptance records, and your sign-in account.</p>
          <p><strong>Kept:</strong> reports made about or by you (identity replaced by a one-way identifier; free-text notes may remain), payment records for subscriptions (detached from your account) and an anonymised record that a deletion occurred. We have not yet set fixed retention periods for these; see the <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.</p>
          <p>Deleting your account does not cancel a Google Play subscription. Cached image links can work for up to one hour. We have not verified whether our database host keeps backups containing deleted data for a limited period.</p>
        </div>
        {!supabase && <div role="alert" className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">Online deletion is not configured on this deployment. Email {SUPPORT_EMAIL} from the address on your account.</div>}

        {supabase && phase === 'signin' && (
          <div className={card}>
            <form onSubmit={signIn} className="space-y-4">
              <label className="block space-y-1"><span className="text-xs font-bold uppercase">Email</span><input className={input} type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label className="block space-y-1"><span className="text-xs font-bold uppercase">Password</span><input className={input} type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
              <button disabled={busy} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in to continue'}</button>
            </form>
            <button onClick={google} className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold">Continue with Google</button>
            <p className="text-xs text-slate-500">Can&apos;t sign in? Email {SUPPORT_EMAIL} and we will help verify ownership. See the <Link href="/privacy-policy" className="underline">Privacy Policy</Link> for what is deleted and what is retained.</p>
          </div>
        )}

        {supabase && (phase === 'confirm' || phase === 'working') && (
          <div className={card}>
            <div className="flex items-start gap-2 text-rose-700"><Trash2 className="w-5 h-5 shrink-0" /><p className="font-bold">This is permanent and cannot be undone.</p></div>
            <ul className="list-disc pl-5 text-xs space-y-1">
              <li>Your profile, photos, selfies, matches, chats and chat media (also removed for the other person), location, call records, coins and sign-in account are deleted.</li>
              <li>Reports about or by you, payment records and an anonymised deletion record are kept in reduced form; see the Privacy Policy.</li>
              <li>Cancel any Google Play subscription separately in Google Play.</li>
            </ul>
            <p className="text-xs">Signed in as <strong>{email}</strong>. Type <strong>DELETE</strong> to confirm.</p>
            <input className={input} value={typed} onChange={(e) => setTyped(e.target.value)} aria-label="Type DELETE to confirm" autoComplete="off" />
            {err && <p role="alert" className="text-xs text-rose-700 flex gap-1.5"><AlertCircle className="w-4 h-4 shrink-0" />{err}</p>}
            <div className="flex gap-2">
              <button onClick={cancel} disabled={phase === 'working'} className="px-4 py-3 rounded-xl border font-bold">Cancel</button>
              <button onClick={del} disabled={typed !== 'DELETE' || phase === 'working'} className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold disabled:opacity-50">{phase === 'working' ? 'Deleting…' : 'Permanently delete my account'}</button>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className={card} role="status">
            <div className="flex items-center gap-2 text-emerald-700 font-bold"><CheckCircle2 className="w-5 h-5" /> Your account has been deleted.</div>
            <p className="text-xs">If you had a Google Play subscription, cancel it in Google Play so you are not billed again.</p>
          </div>
        )}
        {err && phase === 'signin' && <p role="alert" className="text-xs text-rose-700">{err}</p>}
        <p className="text-[11px] text-slate-500 flex gap-1.5"><ShieldCheck className="w-4 h-4 shrink-0" /> Deletion runs through the same secure server function as the in-app option; your identity comes from your verified sign-in only.</p>
      </main>
      <PublicFooter />
    </div>
  );
}
