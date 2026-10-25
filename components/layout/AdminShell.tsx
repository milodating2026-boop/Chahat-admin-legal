'use client';
import React from 'react';
export function PageHead({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function StateBox({ loading, error, empty, emptyText }: { loading?: boolean; error?: string | null; empty?: boolean; emptyText?: string }) {
  if (loading) return <div className="p-8 text-center text-xs text-slate-500" role="status">Loading…</div>;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs" role="alert">{error}</div>;
  if (empty) return <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">{emptyText ?? 'Nothing to show.'}</div>;
  return null;
}
export function Unavailable({ title, why, how }: { title: string; why: string; how?: string }) {
  return (
    <div className="space-y-4">
      <PageHead title={title} />
      <div className="p-6 rounded-2xl bg-white border border-amber-200 text-sm text-slate-700 space-y-2">
        <p className="font-bold text-amber-800">Not available yet</p>
        <p>{why}</p>
        {how && <p className="text-xs text-slate-500">{how}</p>}
      </div>
    </div>
  );
}
export const fmt = (s?: string | null) => (s ? new Date(s).toLocaleString() : '—');
export const short = (id?: string | null) => (id ? id.slice(0, 8) + '…' : '—');
