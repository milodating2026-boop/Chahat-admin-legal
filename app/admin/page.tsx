'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="p-8 text-center text-slate-500 text-xs font-mono">
      Loading Chahat Admin Dashboard...
    </div>
  );
}
