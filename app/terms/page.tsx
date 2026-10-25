'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <PublicHeader />

      <PageBanner
        badge="Legal Agreement"
        title="Terms &amp; Conditions"
        subtitle="The rules, obligations, and guidelines governing your membership and usage of the Chahat platform."
        breadcrumbs={[{ label: 'Terms & Conditions' }]}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300 transition-colors">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Last Updated: October 2026</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">Binding Legal Terms</span>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-mono">1.</span> Acceptance of Terms
            </h2>
            <p>
              By downloading, creating an account on, or interacting with Chahat (&ldquo;App&rdquo; or &ldquo;Service&rdquo;), you enter into a legally binding agreement with Chahat Operations. If you do not consent to all clauses herein, you must immediately uninstall the application and cease accessing our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-mono">2.</span> Strict Age Eligibility (18+ Only)
            </h2>
            <p>
              You must be at least <strong className="text-slate-900 dark:text-white">18 years of age</strong> to register or participate in any feature on Chahat. By using the Service, you represent and warrant that you possess the full legal capacity to enter into this contract. Any profile found to be created or operated by an individual under 18 years will be immediately and irrevocably terminated.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-mono">3.</span> Prohibited Conduct &amp; Content
            </h2>
            <p>Users must not engage in any of the following activities:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Nudity &amp; Sexual Solicitation:</strong> Transmitting sexually explicit imagery, non-consensual sexual content, escort services, or commercial solicitation.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Harassment &amp; Stalking:</strong> Coercive messaging, intimidation, threats of bodily harm, extortion, or continuous contact after being asked to stop.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Impersonation &amp; Fraud:</strong> Presenting fake photos, misrepresenting identity, or soliciting financial transfers, gifts, or cryptocurrency.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Unauthorized Recording:</strong> Attempting to bypass anti-screenshot protections, screen-recording live video calls, or redistributing private communications without express written consent.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-mono">4.</span> Virtual Currency &amp; Subscriptions
            </h2>
            <p>
              In-app coins, video chat minute passes, and VIP memberships are processed solely via Google Play In-App Billing. Virtual assets have no cash redemption value and are non-transferable between accounts. Refund requests are handled per Google Play Store consumer policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-mono">5.</span> Account Termination &amp; Disciplinary Action
            </h2>
            <p>
              We reserve the absolute right to suspend, issue warnings to, or permanently ban any account that violates these Terms or our Community Guidelines without prior warning. Suspended accounts forfeit all accumulated virtual assets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-mono">6.</span> Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or controversy arising from or in connection with the Service shall be subject to the exclusive jurisdiction of the courts of India.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
