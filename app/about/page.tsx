'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Shield,
  Users,
  Target,
  Sparkles,
  Award,
  Globe2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicHeader />

      <PageBanner
        badge="About Chahat"
        title="Our Story, Mission &amp; Purpose"
        subtitle="Empowering adult individuals across India to cultivate authentic, safe, and respectful friendships."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Story Section */}
        <section className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            <Heart className="w-3.5 h-3.5 fill-rose-600 stroke-none" />
            <span>Why We Founded Chahat</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Redefining Online Friendship in India
          </h2>

          <div className="space-y-4 text-base text-slate-600 leading-relaxed">
            <p>
              In today's hyper-connected yet increasingly isolated world, finding genuine friends as an adult is surprisingly difficult. Most mainstream platforms focus on vanity metrics, endless algorithmic feeds, or superficial dating swiping that rarely leads to real conversation.
            </p>
            <p>
              Women and young adults across Indian metropolitan cities and towns often encounter spam, impersonation, unsolicited media, and fake accounts that erode trust in digital communities.
            </p>
            <p className="font-medium text-slate-900">
              Chahat was established with a singular vision: to create a digital sanctuary where adults can connect, talk, share stories, and build lasting friendships with confidence.
            </p>
          </div>
        </section>

        {/* 3 Core Pillars */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Our Three Guiding Pillars</h3>
            <p className="text-sm text-slate-600">The values that govern every feature and community guideline we write.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900">Profile &amp; Content Moderation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Catfishing and anonymous abuse have no place on Chahat. Profile photos are screened automatically, and reports are reviewed by our team, to keep communication respectful.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900">Respect &amp; Consent</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe in mutual consent. Members must match before they can chat, and you can block or report anyone. Explicit content is prohibited by our Community Guidelines.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900">Adult Sanctuary (18+)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chahat is designed exclusively for mature adults. Members must be 18 or older; the date of birth entered at sign-up is checked against this.
              </p>
            </div>
          </div>
        </section>

        {/* Callout box */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-left">
            <h4 className="text-lg font-bold text-slate-900">Join Our Adult Community</h4>
            <p className="text-sm text-slate-600">Download Chahat on Android to connect with genuine friends.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-sm transition-colors whitespace-nowrap"
          >
            <span>Explore Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
