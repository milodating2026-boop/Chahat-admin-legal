'use client';
import { PageHead, StateBox, short } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';

export default function StaffPage() {
  const { data, error, loading } = useAdminData<any>('list_staff');
  return (
    <div className="space-y-5">
      <PageHead title="Staff & Roles" subtitle="Read-only. Staff access is granted only by a project owner directly in the database (user_roles) so no one can escalate privileges from the browser." />
      <StateBox loading={loading} error={error} empty={!!data && data.staff.length === 0} />
      {data && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-sm">
          {data.staff.map((s: any) => <div key={s.userId} className="px-4 py-3 flex justify-between"><span>{s.email ?? short(s.userId)}</span><span className="uppercase text-xs font-extrabold text-rose-700">{s.role}</span></div>)}
        </div>
      )}
    </div>
  );
}
