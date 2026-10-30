'use client';
import { PageHead, StateBox, fmt, short } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';

export default function AuditPage() {
  const { data, error, loading } = useAdminData<any>('list_audit', { limit: 200 });
  return (
    <div className="space-y-5">
      <PageHead title="Audit Log" subtitle="Every privileged action (and app-side system events) with actor, action, target and time. Written server-side; cannot be edited here." />
      <StateBox loading={loading} error={error} empty={!!data && data.entries.length === 0} emptyText="No entries." />
      {data && data.entries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-xs"><thead className="text-left text-slate-500 uppercase tracking-wider"><tr>{['Time', 'Actor', 'Action', 'Target', 'Note'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{data.entries.map((e: any) => <tr key={e.id} className="border-t border-slate-100"><td className="px-4 py-3 whitespace-nowrap">{fmt(e.created_at)}</td><td className="px-4 py-3">{e.actorEmail ?? <span className="font-mono">{short(e.admin_id)}</span>}</td><td className="px-4 py-3 font-semibold">{e.action}</td><td className="px-4 py-3 font-mono">{short(e.target)}</td><td className="px-4 py-3">{e.note}</td></tr>)}</tbody></table>
        </div>
      )}
    </div>
  );
}
