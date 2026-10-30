'use client';
import { PageHead } from '@/components/layout/AdminShell';

const ITEMS: [string, string][] = [
  ['Behavioral analytics', 'No in-app analytics events are collected (privacy by default). Daily business numbers are under Business reports.'],
  ['Crash logs & monitoring', 'No crash reporter (e.g. Sentry/Crashlytics) is wired to this site. Use Supabase function logs and Google Play Console vitals until one is integrated.'],
  ['Photo review', 'Profile photos are reviewed automatically by the moderate-photo function. Selfie verification (switched off in the app for now) is approved or rejected from Users → View.'],
  ['App settings', 'Settings live in the app_settings table, which is restricted to service role. Editing needs a dedicated, audited Edge Function action that has not been built.'],
];
export default function Operations() {
  return (
    <div className="space-y-5">
      <PageHead title="Monitoring" subtitle="These areas are intentionally not faked. Each lists what is missing in the backend." />
      <div className="space-y-3">{ITEMS.map(([t, d]) => <div key={t} className="bg-white rounded-2xl border border-amber-200 p-4 text-sm"><div className="font-bold text-amber-800">{t} — not available</div><p className="text-slate-600 text-xs mt-1">{d}</p></div>)}</div>
    </div>
  );
}
