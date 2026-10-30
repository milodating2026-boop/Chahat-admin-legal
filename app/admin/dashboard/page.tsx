'use client';
import { PageHead, StateBox } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';

export default function Dashboard() {
  const { data, error, loading } = useAdminData<any>('stats');
  const tiles = data ? [
    ['Registered profiles', data.profiles], ['New in last 24 h', data.newLast24h ?? 0], ['Active in last 24 h', data.activeLast24h ?? 0], ['Matches', data.matches],
    ['Open reports', data.openReports], ['Suspended', data.suspended],
  ] : [];
  return (
    <div className="space-y-6">
      <PageHead title="Dashboard" subtitle="Live counts from the production database. Demo profiles are excluded from profile counts." />
      <StateBox loading={loading} error={error} />
      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tiles.map(([l, v]) => (
              <div key={l as string} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">{l}</div>
                <div className="text-3xl font-extrabold mt-1">{v as number}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-sm">
            <div className="font-bold mb-2">Active subscriptions by tier</div>
            {Object.keys(data.activeSubscriptionsByTier).length === 0 ? <span className="text-slate-500 text-xs">No active paid subscriptions.</span> :
              <ul className="space-y-1">{Object.entries(data.activeSubscriptionsByTier).map(([t, n]) => <li key={t}><span className="font-semibold uppercase text-xs">{t}</span>: {n as number}</li>)}</ul>}
          </div>
        </>
      )}
    </div>
  );
}
