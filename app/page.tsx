'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Shield,
  Video,
  Phone,
  UserCheck,
  Lock,
  Download,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  EyeOff,
  Users,
  ShieldCheck,
  FileText,
  Trash2
} from 'lucide-react';
import { PublicHeader, PLAY_STORE_URL } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Chahat — Online Friendship App?',
      a: 'Chahat is a verified social platform designed to help adult individuals (18+) across India connect through authentic conversations. Members can discover compatible friends, send voice notes, and make 1-on-1 audio and video calls with verified profiles.'
    },
    {
      q: 'Who can use Chahat? Is there an age requirement?',
      a: 'Chahat is strictly for adults aged 18 and older. We enforce age confirmation during sign-up. Profiles suspected or confirmed to belong to minors are immediately suspended and permanently removed.'
    },
    {
      q: 'How does Profile Moderation work?',
      a: 'To maintain a genuine and respectful community, all uploaded profile photos and bios undergo review by our safety and moderation team to ensure authenticity and guideline compliance.'
    },
    {
      q: 'Are my audio and video calls private?',
      a: 'Calls are carried by a third-party real-time provider (Agora). We have not claimed end-to-end encryption, and Chahat does not itself record call audio or video. The mobile app also includes screen-capture protection.'
    },
    {
      q: 'How do I submit an account or data deletion request?',
      a: 'You can submit a permanent account deletion request anytime through our online Delete Account Portal or within the mobile app settings. In compliance with Google Play Store data policies, queued requests permanently purge personal data.'
    },
    {
      q: 'How do I contact the Grievance Redressal Officer?',
      a: 'In accordance with the Information Technology Rules 2021, you can email our Grievance Officer at milodating2026@gmail.com. All inquiries are acknowledged within 24 hours.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <PublicHeader />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 pt-16 pb-20 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Mission & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                  <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-500"></span>
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-300 tracking-wide uppercase">
                    Real People &bull; Real Connections
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  Authentic Friendship &amp; Safe Conversations Across India
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                  Chahat connects adult friends through moderated profiles, 1-on-1 audio calling, and live video chats in a respectful, harassment-free environment.
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download on Google Play</span>
                  </a>

                  <Link
                    href="/safety"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors"
                  >
                    <ShieldCheck className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span>Trust &amp; Safety</span>
                  </Link>
                </div>

                {/* Trust Highlights */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">100%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Moderated Profiles</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400">Strictly 18+</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Adults Only</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Live</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live 1-on-1 Calls</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Uploaded Official App Icon Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-6 text-center">
                  <div className="relative w-44 h-44 mx-auto rounded-3xl overflow-hidden border border-rose-500/40 shadow-2xl bg-black flex items-center justify-center">
                    <Image
                      src="/chahat-logo.png"
                      alt="Chahat App Logo"
                      width={176}
                      height={176}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      priority
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight text-white">Chahat</h3>
                    <p className="text-xs font-semibold text-rose-400 tracking-wider uppercase">
                      Real People &bull; Real Connections
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Shield className="w-4 h-4 text-rose-400" />
                      <span>Built for Safe Interaction:</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      <li>&bull; Active photo and profile moderation</li>
                      <li>&bull; Anti-screenshot privacy protection</li>
                      <li>&bull; Zero minors permitted (18+ only)</li>
                      <li>&bull; 1-tap reporting and blocking</li>
                    </ul>
                  </div>

                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Get Chahat on Google Play</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. WHAT CHAHAT DOES */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-md border border-rose-200 dark:border-rose-800">
                About Our Platform
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                What We Do
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Chahat is designed to make adult social connections simple and respectful.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs transition-colors">
                <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Genuine 1-on-1 Conversations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Connect with adults across India who share common interests, languages, and conversation topics in a private, direct setting.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs transition-colors">
                <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Profile Moderation &amp; Authenticity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every profile and uploaded photograph undergoes safety screening to eliminate dishonest accounts, impersonation, and fraudulent actors.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs transition-colors">
                <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  User Safety &amp; Control
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Full control over your communication. Block uncomfortable users instantly, report violations, or delete your account whenever you choose.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CORE FEATURES */}
        <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-md border border-rose-200 dark:border-rose-800">
                Core Features
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Tools for Genuine Connection
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Everything you need to communicate comfortably and safely.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Direct Voice Calling</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Connect over high-quality audio calls without sharing personal telephone numbers or external social media profiles.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Live Video Chat</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Face-to-face video calling with preview safeguards. Calls are carried by a third-party provider and are not recorded by Chahat.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Photo &amp; Profile Moderation</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Active screening ensures community photos adhere to quality standards and prohibit impersonation or prohibited content.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <EyeOff className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Anti-Screenshot Mode</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Built-in screen recording and capture blockers in the mobile app protect your images and calls from unauthorized storage.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Incident Reporting</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  1-tap reporting sends flagged interactions to our moderators, who can suspend accounts.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Self-Service Account Erasure</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Permanent data erasure portal compliant with Google Play Store policies and the Digital Personal Data Protection Act.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. LEGAL & TRANSPARENCY NAVIGATION */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-md border border-rose-200 dark:border-rose-800">
                Documentation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Policies &amp; Compliance Portals
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Read our binding legal terms and community conduct guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/privacy-policy"
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-300 dark:hover:border-rose-600 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Privacy Policy</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    What we collect, who processes it, and how deletion works.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span>Read Policy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/terms"
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-300 dark:hover:border-rose-600 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Terms &amp; Conditions</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    User eligibility (18+), code of conduct, and legal responsibilities on the platform.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span>Read Terms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/community-guidelines"
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-300 dark:hover:border-rose-600 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Community Guidelines</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Zero tolerance for harassment, non-consensual explicit content, or fraudulent behavior.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span>Read Guidelines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/delete-account"
                className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-rose-950 dark:text-rose-200">Account Deletion Portal</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Google Play Store compliant request portal for permanent erasure of your account and data.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                  <span>Submit Deletion Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/support"
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-300 dark:hover:border-rose-600 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Support &amp; Grievance Desk</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Submit inquiries, feedback, or report safety issues directly to our Indian support desk.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span>Contact Support</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/safety"
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-300 dark:hover:border-rose-600 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Safety Standards &amp; SLA</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our commitment to 24-hour grievance redressal and active community safety enforcement.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. FAQS ACCORDION */}
        <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-md border border-rose-200 dark:border-rose-800">
                Help &amp; Answers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Clear answers regarding accounts, verification, and safety on Chahat.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                      <span className="text-sm sm:text-base">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-rose-600 dark:text-rose-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/80 dark:border-slate-800 pt-4 bg-white dark:bg-slate-950">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. DOWNLOAD CALLOUT */}
        <section className="py-16 bg-slate-900 dark:bg-black text-white border-t border-slate-800 dark:border-slate-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border border-slate-700 shadow-lg bg-black">
              <Image
                src="/chahat-logo.png"
                alt="Chahat"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Real People &bull; Real Connections
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Download Chahat today on Android to connect with verified adult friends across India.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl text-base font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Install on Google Play</span>
              </a>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
