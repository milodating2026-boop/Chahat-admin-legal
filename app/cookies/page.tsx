'use client';

import React from 'react';
import Link from 'next/link';
import { Cookie, Shield, CheckCircle2, Lock } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicHeader />

      <PageBanner
        badge="Data Protection"
        title="Cookies &amp; Tracking Policy"
        subtitle="Transparent disclosures on how we utilize cookies and local tokens to secure your sessions."
        breadcrumbs={[{ label: 'Cookies Policy' }]}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 text-xs text-slate-500">
            <span>Last Updated: October 2026</span>
            <span className="font-semibold text-rose-600">Zero Third-Party Advertising Trackers</span>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-rose-600 font-mono">1.</span> What Are Cookies &amp; Local Tokens?
            </h2>
            <p>
              Cookies and secure local storage tokens are small text files placed on your browser or device when you navigate our websites or launch the mobile application. They allow the platform to authenticate your identity, remember security preferences, and detect unusual network access patterns.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-rose-600 font-mono">2.</span> Categories of Cookies We Use
            </h2>
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Essential Authentication Tokens</h4>
                </div>
                <p className="text-xs text-slate-600">
                  Required for you to sign in to your profile and admin portal. These tokens protect your session and expire automatically upon logging out.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Security &amp; Fraud Prevention</h4>
                </div>
                <p className="text-xs text-slate-600">
                  Used to recognize brute-force login attempts, unauthorized API calls, and automated bot scrapers trying to harvest member profiles.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-rose-600 font-mono">3.</span> No Behavioral Ad Tracking
            </h2>
            <p>
              Unlike conventional ad-supported social networks, Chahat does <strong>not</strong> install cross-site tracking cookies, behavioral pixel trackers, or third-party data broker identifiers. We never sell your viewing habits or chat metadata to third parties.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
