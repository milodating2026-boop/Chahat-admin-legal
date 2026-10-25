'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/services/supabase';

export default function ResetPage() {
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The emailed link signs the user in with a short-lived recovery session; only then can a new password be set.
    const { data } = supabase?.auth.onAuthStateChange((ev) => { if (ev === 'PASSWORD_RECOVERY') setReady(true); }) ?? { data: null };
    return () => data?.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    if (pw.length < 10) { setMsg('Use at least 10 characters.'); return; }
    const { error } = await supabase!.auth.updateUser({ password: pw });
    if (error) { setMsg('Could not update the password. Request a new reset link.'); return; }
    await supabase!.auth.signOut(); setDone(true);
  };

  return (
    <div className="admin-ui min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-4">
        <h1 className="text-xl font-extrabold">Set a new password</h1>
        {done ? <p role="status" className="text-sm">Password updated. <Link href="/admin-login" className="underline text-rose-700">Sign in</Link></p>
          : !ready ? <p className="text-sm text-slate-600">Open this page from the link in your reset email. <Link href="/admin-login" className="underline text-rose-700">Back to sign in</Link></p>
          : <form onSubmit={submit} className="space-y-3">
              <input type="password" required autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
              {msg && <p role="alert" className="text-xs text-rose-700">{msg}</p>}
              <button className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-sm">Update password</button>
            </form>}
      </div>
    </div>
  );
}
