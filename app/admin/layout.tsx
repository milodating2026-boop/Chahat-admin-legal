'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, ShieldAlert, CreditCard, History, UserPlus, Activity, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { AdminSessionProvider, useAdminSession } from '@/services/session';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { href: '/admin/users', label: 'Users', icon: Users, adminOnly: false },
  { href: '/admin/reports', label: 'Reports & Moderation', icon: ShieldAlert, adminOnly: false },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard, adminOnly: true },
  { href: '/admin/staff', label: 'Staff & Roles', icon: UserPlus, adminOnly: true },
  { href: '/admin/audit-logs', label: 'Audit Log', icon: History, adminOnly: true },
  { href: '/admin/operations', label: 'Notifications, Analytics & Monitoring', icon: Activity, adminOnly: false },
];

function Shell({ children }: { children: React.ReactNode }) {
  const { status, role, email, signOut } = useAdminSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { if (status === 'signed_out' || status === 'forbidden') router.replace('/admin-login'); }, [status, router]);
  useEffect(() => { setOpen(false); }, [pathname]);

  // Render nothing privileged until the SERVER has confirmed the role. (UI gating is convenience only; the Edge Function enforces.)
  if (status !== 'ready') return <div className="admin-ui min-h-screen flex items-center justify-center text-xs text-slate-500" role="status">Verifying access…</div>;

  const items = NAV.filter((n) => !n.adminOnly || role === 'admin');
  const nav = (
    <nav className="p-3 space-y-1" aria-label="Admin">
      {items.map((n) => {
        const on = pathname === n.href;
        return (
          <Link key={n.href} href={n.href} aria-current={on ? 'page' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold ${on ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <n.icon className="w-4 h-4" /> {n.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="admin-ui min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-xl border border-slate-200" aria-label="Toggle navigation">{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 bg-black flex items-center justify-center"><Image src="/chahat-logo.png" alt="Chahat" width={36} height={36} /></span>
            <span className="font-extrabold text-sm">Chahat Control Center</span>
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Link href="/" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-slate-700 bg-slate-100 border border-slate-300"><ArrowLeft className="w-3.5 h-3.5 text-rose-600" /> Public site</Link>
          <div className="hidden md:block text-right"><div className="font-bold">{email}</div><div className="text-[10px] uppercase tracking-wider text-rose-700 font-extrabold">{role}</div></div>
          <button onClick={async () => { await signOut(); router.replace('/admin-login'); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 font-bold"><LogOut className="w-3.5 h-3.5" /> Sign out</button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200">{nav}</aside>
        {open && <div className="lg:hidden fixed inset-x-0 top-16 z-30 bg-white border-b border-slate-200 shadow-lg">{nav}</div>}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminSessionProvider><Shell>{children}</Shell></AdminSessionProvider>;
}
