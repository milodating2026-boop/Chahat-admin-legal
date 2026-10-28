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
  friendlyOAuthReturnError, friendlyRequestError, successMessage,
  type RequestResult,
} from '@/lib/accountErrors';


type Phase = 'signin' | 'confirm' | 'working' | 'done';

export default function DeleteAccountPage() {
  const [phase, setPhase] = useState<Phase>('signin');
  const [email, setEmail] = useState('');
  const [typed, setTyped] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RequestResult>(null);
  const submitting = React.useRef(false);

  // Resume when a session already exists (returning from Google, or a page refresh), and surface OAuth errors.
  React.useEffect(() => {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const oauthErr = url.searchParams.get('error_description') || url.searchParams.get('error') || hash.get('error_description') || hash.get('error');
    if (oauthErr) setErr(friendlyOAuthReturnError(oauthErr));
    supabase?.auth.getSession().then(({ data }) => {
      if (data.session) { setEmail(data.session.user.email ?? ''); setPhase((p) => (p === 'signin' ? 'confirm' : p)); }
    });
    const sub = supabase?.auth.onAuthStateChange((evt, session) => {
      if (evt === 'SIGNED_IN' && session) { setEmail(session.user.email ?? ''); setPhase((p) => (p === 'signin' ? 'confirm' : p)); }
    });
    return () => sub?.data.subscription.unsubscribe();
  }, []);

  const google = async () => {
    if (busy) return;
    setErr(''); setBusy(true);
    const { data, error } = await supabase!.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/delete-account`, skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } },
    });
    if (error || !data?.url) { setBusy(false); setErr(friendlyOAuthReturnError(null)); return; }
    window.location.assign(data.url);
    // If the browser is still on this page after 10 seconds, the redirect did not happen: stop the spinner and say so.
    setTimeout(() => { setBusy(false); setErr('Google did not respond. Please try again, or use a different browser.'); }, 10000);
  };
  const del = async () => {
    if (submitting.current) return; // blocks double-clicks / duplicate submissions
    submitting.current = true;
    setErr(''); setPhase('working');
    const { data, error } = await supabase!.functions.invoke('request-account-deletion', { body: { confirm: true } });
    if (error || !data?.success) {
      submitting.current = false;
      const status = (error as { context?: { status?: number } } | null)?.context?.status;
      if (status === 401) { await supabase!.auth.signOut(); setPhase('signin'); setErr(friendlyRequestError(error, 401)); return; }
      setPhase('confirm'); setErr(friendlyRequestError(error, status));
      return;
    }
    setResult(data);
    await supabase!.auth.signOut();
    setPhase('done');
  };
  const cancel = async () => { await supabase?.auth.signOut(); setTyped(''); setErr(''); setPhase('signin'); };

  const card = 'bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 text-sm text-slate-700 dark:text-slate-300';
  const input = 'w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-950 text-sm';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <PublicHeader />
      <PageBanner badge="Your data" title="Delete Your Account" subtitle="Request permanent deletion of your Chahat account and data. We verify your Google account first so we know the account is yours." breadcrumbs={[{ label: 'Delete Account' }]} />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 space-y-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
          <p className="font-bold text-slate-900 dark:text-white">Chahat — Online Friendship App (com.chahat.dating)</p>
          <p><strong>Deleted:</strong> profile, photos and verification selfies, voice intro, matches, likes and blocks, messages and chat media (also removed for the other person), location data, push tokens and settings, consent and acceptance records, and your sign-in account.</p>
          <p><strong>Kept:</strong> reports made about or by you (identity replaced by a pseudonymous identifier, a hash of your account ID that is not anonymous; free-text notes may remain), payment records for subscriptions (detached from your account) and a pseudonymised record that a deletion occurred. We have not yet set fixed retention periods for these; see the <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.</p>
          <p>Deleting your account does not cancel a Google Play subscription. Cached image links can work for up to one hour. We have not verified whether our database host keeps backups containing deleted data for a limited period.</p>
        </div>
        {!supabase && <div role="alert" className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">Online deletion is not configured on this deployment. Email {SUPPORT_EMAIL} from the address on your account.</div>}

        {supabase && phase === 'signin' && (
          <div className={card}>
            <p className="text-xs">Sign in with the Google account you used for Chahat so we can verify the account is yours.</p>
            <button onClick={google} disabled={busy} className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold disabled:opacity-60">{busy ? 'Redirecting to Google…' : 'Continue with Google'}</button>
            <p className="text-xs text-slate-500">Can&apos;t sign in? Contact {SUPPORT_EMAIL} and we will help verify ownership. See the <Link href="/privacy-policy" className="underline">Privacy Policy</Link> for what is deleted and what is retained.</p>
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
        {err && phase === 'signin' && <p role="alert" className="text-xs text-rose-700">{err}</p>}
        <p className="text-[11px] text-slate-500 flex gap-1.5"><ShieldCheck className="w-4 h-4 shrink-0" /> Requests are processed by the same secure server-side deletion as the in-app option; your identity comes from your verified sign-in only.</p>
      </main>
      <PublicFooter />
    </div>
  );
}
