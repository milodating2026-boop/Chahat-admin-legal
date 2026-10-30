'use client';
import { useState } from 'react';
import { PageHead, StateBox, fmt, short } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';

const STATE_STYLE: Record<string, string> = { ACTIVE: 'bg-emerald-50 text-emerald-700', IN_GRACE_PERIOD: 'bg-amber-50 text-amber-700', CANCELED: 'bg-slate-100 text-slate-600', EXPIRED: 'bg-slate-100 text-slate-600', REVOKED: 'bg-rose-50 text-rose-700', REFUNDED: 'bg-rose-50 text-rose-700' };
const OUTCOME_STYLE: Record<string, string> = { verified: 'bg-emerald-50 text-emerald-700', pending: 'bg-amber-50 text-amber-700', failed: 'bg-rose-50 text-rose-700', retryable: 'bg-slate-100 text-slate-600' };

export default function PaymentsPage() {
  const summary = useAdminData<any>('payments_summary');
  const orders = useAdminData<any>('list_subscriptions');
  const [outcome, setOutcome] = useState('');
  const attempts = useAdminData<any>('list_purchase_attempts', { outcome: outcome || undefined });
  const s = summary.data?.last30Days;

  return (
    <div className="space-y-6">
      <PageHead title="Payments & Transactions" subtitle="Verified Google Play purchases, and every purchase attempt (including failed and pending ones). Purchase tokens are never shown. Refunds are made in Google Play Console; they appear here as REVOKED once Google notifies the app." />
      <StateBox loading={summary.loading} error={summary.error} />
      {s && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[['Orders (30 days)', s.orders], ['Revenue (30 days)', `₹${Number(s.revenueInr).toLocaleString('en-IN')}`], ['Failed attempts (30 days)', s.failedAttempts], ['Refunds / revocations', s.refundsOrRevocations]].map(([l, v]) => (
            <div key={l as string} className="bg-white rounded-2xl border border-slate-200 p-5"><div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">{l}</div><div className="text-2xl font-extrabold mt-1">{v as any}</div></div>
          ))}
        </div>
      )}
      <h2 className="font-extrabold">Orders</h2>
      <StateBox loading={orders.loading} error={orders.error} empty={!!orders.data && orders.data.orders.length === 0} emptyText="No purchase records yet." />
      {orders.data?.orders?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-xs"><thead className="text-left text-slate-500 uppercase tracking-wider"><tr>{['Date', 'User', 'Store', 'Order', 'Product', 'Tier', '₹', 'State', 'Expires'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{orders.data.orders.map((o: any) => (
              <tr key={o.id} className="border-t border-slate-100"><td className="px-4 py-3">{fmt(o.created_at)}</td><td className="px-4 py-3 font-mono">{short(o.user_id)}</td><td className="px-4 py-3">{o.store}</td><td className="px-4 py-3 font-mono">{o.order_id ?? '—'}</td><td className="px-4 py-3">{o.product_id}</td><td className="px-4 py-3 uppercase">{o.tier}</td><td className="px-4 py-3">{o.amount_inr}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full font-bold ${STATE_STYLE[o.provider_state] ?? 'bg-slate-100'}`}>{o.provider_state ?? '—'}</span></td><td className="px-4 py-3">{fmt(o.expires_at)}</td></tr>
            ))}</tbody></table>
        </div>
      )}
      <div className="flex items-center justify-between"><h2 className="font-extrabold">Purchase attempts</h2>
        <select value={outcome} onChange={(e) => setOutcome(e.target.value)} aria-label="Outcome" className="px-3 py-2 rounded-xl border border-slate-300 text-sm">
          <option value="">All</option><option value="failed">Failed</option><option value="pending">Pending</option><option value="retryable">Temporary errors</option><option value="verified">Verified</option></select></div>
      <StateBox loading={attempts.loading} error={attempts.error} empty={!!attempts.data && attempts.data.attempts.length === 0} emptyText="No attempts recorded yet." />
      {attempts.data?.attempts?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-xs"><thead className="text-left text-slate-500 uppercase tracking-wider"><tr>{['Date', 'User', 'Product', 'Outcome', 'HTTP', 'Reason'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{attempts.data.attempts.map((a: any) => (
              <tr key={a.id} className="border-t border-slate-100"><td className="px-4 py-3">{fmt(a.created_at)}</td><td className="px-4 py-3 font-mono">{short(a.user_id)}</td><td className="px-4 py-3">{a.product_id ?? '—'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full font-bold ${OUTCOME_STYLE[a.outcome]}`}>{a.outcome}</span></td><td className="px-4 py-3">{a.http_status}</td><td className="px-4 py-3">{a.reason ?? '—'}</td></tr>
            ))}</tbody></table>
        </div>
      )}
    </div>
  );
}
