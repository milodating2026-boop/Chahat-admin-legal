'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, UserCheck, ShieldAlert } from 'lucide-react';
import { AdminSessionProvider, useAdminSession } from '@/services/session';

function LoginForm() {
  const router = useRouter();
  const { signIn, status, signInWithGoogle, sendReset } = useAdminSession();
  const [resetSent, setResetSent] = useState(false);

  // Returning from Google: once the server confirms a staff role, go in.
  useEffect(() => { if (status === 'ready') router.replace('/admin/dashboard'); }, [status, router]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    const problem = await signIn(email, password);
    setBusy(false);
    // Deliberately generic: do not reveal whether an account exists or whether it is staff.
    if (problem) { setErr(problem); return; }
    router.replace('/admin/dashboard');
  };

  return (
    <div className="admin-ui min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between p-4 sm:p-6 font-sans">
      <div className="max-w-6xl w-full mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700">
          <ArrowLeft className="w-4 h-4 text-rose-600" /><span>Back to Chahat Website</span>
        </Link>
      </div>
      <div className="max-w-md w-full mx-auto my-8 bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-[72px] h-[72px] mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-black">
            <Image src="/chahat-logo.png" alt="Chahat" width={72} height={72} priority />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Chahat Control Center</h1>
          <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">Authorized staff only</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p>Access is granted by the server. Signing in with a non-staff account will not open the console.</p>
        </div>
        {(err || status === 'forbidden') && (
          <div role="alert" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{err || 'This account is not authorized for the admin console.'}</span>
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Email</span>
            <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Password</span>
            <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
          </label>
          <button type="button" onClick={async () => { if (!email) { setErr('Enter your email first.'); return; } await sendReset(email); setResetSent(true); }} className="text-xs text-rose-700 underline">Forgot password?</button>
          {resetSent && <p role="status" className="text-xs text-slate-600">If that email has an account, a reset link has been sent.</p>}
          <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold text-sm">
            <UserCheck className="w-4 h-4" /><span>{busy ? 'Verifying…' : 'Sign in'}</span>
          </button>
        </form>
        <button type="button" onClick={async () => { const m = await signInWithGoogle(); if (m) setErr(m); }} className="w-full py-3 rounded-xl border border-slate-300 font-bold text-sm">Continue with Google</button>
        <p className="text-[11px] text-slate-500 text-center">Google only proves who you are. Only accounts the server lists as staff can open the console.</p>
      </div>
      <div className="text-center text-xs text-slate-500">&copy; {new Date().getFullYear()} Chahat &bull; Internal operations console</div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <AdminSessionProvider><LoginForm /></AdminSessionProvider>;
}
