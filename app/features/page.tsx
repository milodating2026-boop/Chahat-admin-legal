'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Video,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Lock,
  EyeOff,
  Languages,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { PublicHeader, PLAY_STORE_URL } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';

export default function FeaturesPage() {
  const featureList = [
    {
      icon: Phone,
      color: 'bg-rose-100 text-rose-600',
      title: 'Private Voice Calls',
      desc: 'Connect in real-time with crystal-clear voice fidelity. Calls are routed without disclosing either party’s personal mobile number or SIM data.',
      benefits: ['No phone number shared with the other member', 'HD audio codecs optimized for 4G/5G', 'Mute, speaker, and 1-tap disconnect']
    },
    {
      icon: Video,
      color: 'bg-blue-100 text-blue-600',
      title: 'Real-Time Live Video Chat',
      desc: 'Face-to-face conversations. You choose when to answer and when to turn your video on.',
      benefits: ['You choose when to answer', 'Chat screens block screenshots on Android', 'Instant disconnect & report button']
    },
    {
      icon: UserCheck,
      color: 'bg-emerald-100 text-emerald-600',
      title: 'Active Profile &amp; Content Moderation',
      desc: 'Profile photos are screened, reports are reviewed by our team, and members must be adults over 18.',
      benefits: ['Automated photo screening', 'Moderator review of reports', 'Strict 18+ community standards']
    },
    {
      icon: EyeOff,
      color: 'bg-amber-100 text-amber-600',
      title: 'Voice Messages and View-Once Photos',
      desc: 'Send voice messages and view-once photos in chat, and delete messages for yourself or for everyone.',
      benefits: ['Voice messages in chat', 'View-once photos', 'Delete for me or for everyone']
    },
    {
      icon: Languages,
      color: 'bg-purple-100 text-purple-600',
      title: 'Multi-Language Cultural Filters',
      desc: 'India is diverse, and friendships thrive in your native tongue. Add the languages you speak to your profile and meet people who share them.',
      benefits: ['Languages on your profile', 'Discovery by city and distance', 'Respectful multicultural community']
    },
    {
      icon: ShieldAlert,
      color: 'bg-red-100 text-red-600',
      title: '1-Tap Emergency Block & Incident Reporting',
      desc: 'If anyone behaves inappropriately, violates guidelines, or causes discomfort, you can block them instantly. Blocked users can never view your profile or contact you again.',
      benefits: ['Immediate communication severance', 'Reports go to our moderators', 'Report from any profile or chat']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicHeader />

      <PageBanner
        badge="Platform Highlights"
        title="Built for Privacy, Authenticity &amp; Delight"
        subtitle="Explore the safety features and communication tools that make Chahat India's premier friendship app."
        breadcrumbs={[{ label: 'Features' }]}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureList.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                <ul className="space-y-2 pt-2 border-t border-slate-100">
                  {item.benefits.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Experience All Features on Android</h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Install the latest version of Chahat from Google Play and start chatting today.
          </p>
          <div className="pt-2">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xs transition-colors"
            >
              <span>Download Chahat from Play Store</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
