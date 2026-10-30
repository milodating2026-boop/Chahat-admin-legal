'use client';
import { useState } from 'react';
import { PageHead, StateBox } from '@/components/layout/AdminShell';
import { callAdmin, friendlyError } from '@/services/adminApi';
import { downloadText } from '@/services/download';

const iso = (d: Date) => d.toISOString().slice(0, 10);
const COLS: [string, string][] = [['day', 'Day'], ['signups', 'Sign-ups'], ['profiles_completed', 'Profiles done'], ['likes', 'Likes'], ['matches', 'Matches'], ['messages', 'Messages'], ['video_calls', 'Calls'], ['reports', 'Reports'], ['new_paid_orders', 'Paid orders'], ['revenue_inr', 'Revenue ₹'], ['failed_payments', 'Failed payments'], ['ad_impressions', 'Ad views'], ['ad_clicks', 'Ad clicks']];

export default function BusinessReports() {
  const [from, setFrom] = useState(iso(new Date(Date.now() - 29 * 86400000)));
  const [to, setTo] = useState(iso(new Date()));
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true); setError(null);
    try { setData(await callAdmin('business_report', { from, to })); } catch (e) { setError(friendlyError(e)); } finally { setLoading(false); }
  };
  const users = async () => {
    try { const r = await callAdmin<any>('export_users'); downloadText(`chahat-users-${iso(new Date())}.csv`, r.csv); } catch (e) { setError(friendlyError(e)); }
  };
  const total = (k: string) => (data?.rows ?? []).reduce((a: number, r: any) => a + Number(r[k] ?? 0), 0);

  return (
    <div className="space-y-5">
      <PageHead title="Business reports" subtitle="Daily numbers straight from the database (India time). Download as CSV for Excel or Google Sheets. The users export has no email, phone, chats or photos." />
      <div className="flex flex-wrap items-end gap-2 text-sm">
        <label><span className="block text-xs font-bold text-slate-600">From</span><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300" /></label>
        <label><span className="block text-xs font-bold text-slate-600">To</span><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300" /></label>
        <button onClick={run} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold">Generate</button>
        {data?.csv && <button onClick={() => downloadText(`chahat-report-${from}-to-${to}.csv`, data.csv)} className="px-4 py-2 rounded-xl border font-bold">Download CSV</button>}
        <button onClick={users} className="px-4 py-2 rounded-xl border font-bold">Download users CSV</button>
      </div>
      <StateBox loading={loading} error={error} empty={!!data && data.rows.length === 0} emptyText="No data for these dates." />
      {data?.rows?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-left text-slate-500 uppercase tracking-wider"><tr>{COLS.map(([, l]) => <th key={l} className="px-3 py-3 whitespace-nowrap">{l}</th>)}</tr></thead>
            <tbody>
              {data.rows.map((r: any) => <tr key={r.day} className="border-t border-slate-100">{COLS.map(([k]) => <td key={k} className="px-3 py-2">{r[k]}</td>)}</tr>)}
              <tr className="border-t-2 border-slate-300 font-bold">{COLS.map(([k], i) => <td key={k} className="px-3 py-2">{i === 0 ? 'Total' : total(k)}</td>)}</tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
