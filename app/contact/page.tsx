'use client';
import { Mail } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';
import { SUPPORT_EMAIL } from '@/lib/contact';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <PublicHeader />
      <PageBanner badge="Get in touch" title="Contact Us" subtitle="Support, safety concerns, privacy requests and grievances." breadcrumbs={[{ label: 'Contact' }]} />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 text-sm">
          <Mail className="w-6 h-6 text-rose-600" />
          <p>Email: <a className="font-semibold text-rose-600 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
          <p className="text-xs text-slate-500">Grievance Officer details are in the Privacy Policy. To delete your account, use the Delete Account page.</p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
