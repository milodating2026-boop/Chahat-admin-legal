'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';
import { LEGAL_LAST_UPDATED, LEGAL_REVIEW_STATUS } from '@/lib/legal';

// Shared shell for the long legal documents. Uses the same classes as the original pages
// so the look is unchanged.
export function LegalShell({
  badge,
  title,
  subtitle,
  crumb,
  children,
}: {
  badge: string;
  title: string;
  subtitle: string;
  crumb: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <PublicHeader />
      <PageBanner badge={badge} title={title} subtitle={subtitle} breadcrumbs={[{ label: crumb }]} />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300 transition-colors">
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Last updated: {LEGAL_LAST_UPDATED}</span>
            {LEGAL_REVIEW_STATUS ? (
              <span className="font-semibold text-rose-600 dark:text-rose-400">{LEGAL_REVIEW_STATUS}</span>
            ) : null}
          </div>
          {children}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

export function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <span className="text-rose-600 dark:text-rose-400 font-mono">{n}.</span> {title}
      </h2>
      {children}
    </section>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
      {children}
    </div>
  );
}

export function DataTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-xs text-left">
        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold align-top">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 align-top">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const strong = 'text-slate-900 dark:text-white';
export const link = 'text-rose-600 dark:text-rose-400 font-medium underline';
