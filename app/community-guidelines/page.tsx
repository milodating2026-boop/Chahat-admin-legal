'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <PublicHeader />

      <PageBanner
        badge="Community Standards"
        title="Community Guidelines"
        subtitle="The values of mutual respect, consent, and safety that every Chahat member agrees to uphold."
        breadcrumbs={[{ label: 'Community Guidelines' }]}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300 transition-colors">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Treat Everyone with Dignity &amp; Respect</h2>
            <p>
              Chahat is designed as an inclusive, safe platform for authentic human connection. We welcome individuals of diverse backgrounds, languages, and cultures across India. Treat other members with kindness, courtesy, and empathy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Respect Personal Boundaries &amp; Consent</h2>
            <p>
              Consent is fundamental. If another member indicates that they do not wish to continue chatting, turn on video, or exchange voice notes, respect their decision immediately. Repeated unwanted messages or aggressive demands will result in account suspension.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white text-rose-700 dark:text-rose-400">3. Absolute Zero Tolerance Violations</h2>
            <p className="font-medium text-slate-900 dark:text-slate-200">
              The following behaviors result in account suspension and, where the law requires, referral to authorities:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li><strong className="text-slate-800 dark:text-slate-200">Child Sexual Abuse Material (CSAM):</strong> Any depiction, solicitation, or reference to minors is strictly reported to law enforcement agencies and cybercrime authorities.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Non-Consensual Sexual Content:</strong> Transmitting unsolicited explicit photos, exposure during live video calls, or threats to leak private media.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Hate Speech &amp; Defamation:</strong> Content promoting hatred or violence based on religion, caste, race, ethnicity, disability, gender, or sexual orientation.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Financial Scams &amp; Extortion:</strong> Requesting UPI transfers, bank details, cryptocurrency, or pretending to be in emergency distress.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Enforcement</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reports are reviewed by our moderators. Accounts that break these guidelines can be suspended, which stops messaging, and suspended accounts can be restored if we find a mistake was made. We do not publish a fixed warning or strike schedule.</p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
