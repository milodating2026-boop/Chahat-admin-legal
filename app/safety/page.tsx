'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Scale
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';
import { OPERATOR } from '@/lib/legal';

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <PublicHeader />

      <PageBanner
        badge="Safety &amp; Compliance"
        title="Trust, Safety &amp; Community Protection"
        subtitle="How Chahat creates a safer, respectful environment for adult friendship across India."
        breadcrumbs={[{ label: 'Trust & Safety' }]}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Section 1: Moderation & Quality */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Community Authenticity</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Profile &amp; Photo Moderation Standards
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Every member engaging in conversations on Chahat must adhere to strict profile guidelines. Profile photos are screened by an automated image-moderation service for explicit and violent content, and our safety team reviews member reports and can suspend accounts that break our rules, including impersonation, unauthorized advertisements and dishonest behaviour.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Step 1</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Community Standards</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Profiles must feature clear, respectful photos with honest representations of identity.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Step 2</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Automated Content Filter</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Profile photos are screened by an automated image-moderation service before they are shown.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Step 3</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Human Team Audit</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Our safety team reviews user reports. We have not published fixed review times.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Zero Tolerance */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Strict Code of Conduct</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Zero Tolerance for Harassment &amp; Underage Access
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              Our moderators can <strong className="text-slate-900 dark:text-white">suspend accounts</strong> that break the Community Guidelines, including for non-consensual explicit conduct, solicitation, blackmail, hate speech, or harassment.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Strictly 18+:</strong> We do not allow minors on the platform under any circumstances. Accounts suspected of belonging to individuals under 18 are suspended pending review.
            </p>
          </div>
        </section>

        {/* Section 3: Grievance Officer */}
        <section className="bg-slate-900 dark:bg-slate-950 text-white p-8 sm:p-10 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Indian Grievance Redressal Mechanism</h3>
              <p className="text-xs text-slate-300">Under Rule 3(2) of Information Technology (Intermediary Guidelines) Rules, 2021</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            If you have any safety grievance, dispute, or report that requires regulatory escalation, our designated Grievance Officer is available to assist you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-slate-400">Designated Grievance Officer:</span>
              <p className="font-semibold text-white text-sm">{OPERATOR.grievanceOfficerDesignation}</p>
              <p className="text-slate-300">{OPERATOR.name}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-slate-400">Official Electronic Contact:</span>
              <p className="font-semibold text-rose-300 text-sm">
                <a href="mailto:milodating2026@gmail.com" className="hover:underline">milodating2026@gmail.com</a>
              </p>
              <p className="text-slate-300">Acknowledgment target: 24 hours (to be confirmed by Chahat)</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-slate-400">Postal Address:</span>
              <p className="font-medium text-slate-300 text-xs leading-relaxed">
                {OPERATOR.address}
              </p>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
