'use client';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import { callAdmin } from './adminApi';

export type StaffRole = 'admin' | 'moderator';
type Status = 'loading' | 'signed_out' | 'forbidden' | 'ready';
interface Ctx {
  status: Status; role: StaffRole | null; email: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<string | null>;
  sendReset: (email: string) => Promise<void>;
}
const SessionCtx = createContext<Ctx | null>(null);
const IDLE_MS = 30 * 60 * 1000;

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [role, setRole] = useState<StaffRole | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setRole(null); setEmail(null); setStatus('signed_out');
  }, []);

  const verify = useCallback(async (): Promise<boolean> => {
    if (!supabase) { setStatus('signed_out'); return false; }
    const { data } = await supabase.auth.getSession();
    if (!data.session) { setStatus('signed_out'); return false; }
    try {
      const me = await callAdmin<{ role: StaffRole; email: string | null }>('whoami');
      setRole(me.role); setEmail(me.email); setStatus('ready');
      return true;
    } catch {
      await supabase.auth.signOut(); // authenticated but not staff (or server unreachable): drop the session
      setRole(null); setEmail(null); setStatus('forbidden');
      return false;
    }
  }, []);

  useEffect(() => {
    verify();
    const { data: sub } = supabase?.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT') { setRole(null); setStatus((s) => (s === 'forbidden' ? s : 'signed_out')); } }) ?? { data: null };
    return () => sub?.subscription.unsubscribe();
  }, [verify]);

  useEffect(() => { // idle session expiry
    if (status !== 'ready') return;
    const reset = () => { if (idle.current) clearTimeout(idle.current); idle.current = setTimeout(() => { signOut(); }, IDLE_MS); };
    const evs = ['mousemove', 'keydown', 'click', 'touchstart'];
    evs.forEach((e) => window.addEventListener(e, reset)); reset();
    return () => { evs.forEach((e) => window.removeEventListener(e, reset)); if (idle.current) clearTimeout(idle.current); };
  }, [status, signOut]);

  const signIn = useCallback(async (em: string, pw: string) => {
    if (!supabase) return 'Supabase is not configured for this deployment.';
    setStatus('loading');
    const { error } = await supabase.auth.signInWithPassword({ email: em.trim(), password: pw });
    if (error) { setStatus('signed_out'); return 'Invalid email or password.'; }
    // Fail closed: a valid login for a non-staff account is signed out again and never reaches the console.
    return (await verify()) ? null : 'This account is not authorized for the admin console.';
  }, [verify]);

  // Google only authenticates. Access is still decided by the server (admin-api -> user_roles) after the redirect back.
  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return 'Supabase is not configured for this deployment.';
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/admin-login` } });
    return error ? 'Google sign-in is not available right now.' : null;
  }, []);

  // Always succeeds from the caller's view so the form never reveals which emails have accounts.
  const sendReset = useCallback(async (em: string) => {
    await supabase?.auth.resetPasswordForEmail(em.trim(), { redirectTo: `${window.location.origin}/admin-login/reset` }).catch(() => null);
  }, []);

  return <SessionCtx.Provider value={{ status, role, email, signIn, signOut, signInWithGoogle, sendReset }}>{children}</SessionCtx.Provider>;
}

export const useAdminSession = () => {
  const c = useContext(SessionCtx);
  if (!c) throw new Error('AdminSessionProvider missing');
  return c;
};
