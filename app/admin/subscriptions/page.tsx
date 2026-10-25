'use client';
import { PageHead, StateBox, fmt, short } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';

export default function SubscriptionsPage() {
  const { data, error, loading } = useAdminData<any>('list_subscriptions');
  return (
    <div className="space-y-5">
      <PageHead title="Subscriptions" subtitle="Verified purchase records (read-only). Purchase tokens are never shown. Refunds and plan changes must be performed in Google Play Console; they are not available here." />
      <StateBox loading={loading} error={error} empty={!!data && data.orders.length === 0} emptyText="No purchase records yet." />
      {data && data.orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-xs"><thead className="text-left text-slate-500 uppercase tracking-wider"><tr>{['Date', 'User', 'Store', 'Product', 'Tier', 'Amount (INR)', 'Expires'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{data.orders.map((o: any) => <tr key={o.id} className="border-t border-slate-100"><td className="px-4 py-3">{fmt(o.created_at)}</td><td className="px-4 py-3 font-mono">{short(o.user_id)}</td><td className="px-4 py-3">{o.store}</td><td className="px-4 py-3">{o.product_id}</td><td className="px-4 py-3 uppercase">{o.tier}</td><td className="px-4 py-3">{o.amount_inr}</td><td className="px-4 py-3">{fmt(o.expires_at)}</td></tr>)}</tbody></table>
        </div>
      )}
    </div>
  );
}
