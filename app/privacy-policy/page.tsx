'use client';

import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 2026';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <PublicHeader />

      <PageBanner
        badge="Legal &amp; Compliance"
        title="Privacy Policy"
        subtitle="What Chahat collects, why, who processes it, and how you can delete it."
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300 transition-colors">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Effective Date: {lastUpdated}</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">Draft for legal review</span>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-mono">1.</span> Introduction &amp; Commitment to Privacy
            </h2>
            <p>
              Welcome to <strong className="text-slate-900 dark:text-white">Chahat — Online Friendship App</strong> (&ldquo;Chahat&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We are deeply dedicated to protecting your privacy and personal data. This Privacy Policy outlines what information we gather when you download, install, register, and use our mobile application and related web services, and how that information is utilized and guarded.
            </p>
            <p>
              By accessing Chahat, you acknowledge that you are at least 18 years of age and explicitly agree to the collection and handling of your information as detailed in this policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><span className="text-rose-600 dark:text-rose-400 font-mono">2.</span> Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li><strong>Account:</strong> email address and sign-in credentials (or Google sign-in), managed by Supabase Authentication.</li>
              <li><strong>Profile:</strong> name, date of birth (to enforce 18+), gender and who you are seeking, city, bio, work and education, interests, languages, lifestyle and prompt answers, and profile photos. Optional voice introduction.</li>
              <li><strong>Verification selfies:</strong> if you choose to verify, a selfie you submit is stored with your account data.</li>
              <li><strong>Location:</strong> if you grant permission, a location is used for discovery and distance. Location choices and a city anchor are stored; exact distance to others is not shown to them.</li>
              <li><strong>Chats:</strong> messages, reactions, replies, photos and voice messages you send to your matches are stored on our servers so they can be delivered to the other person.</li>
              <li><strong>Activity:</strong> likes, passes, matches, blocks, reports you make or receive, daily usage limits, and call records (who, when, duration, state).</li>
              <li><strong>Purchases:</strong> subscription and coin purchases through Google Play Billing (order id, product, amount, dates, verified purchase-token hash) and your coin balance and ledger.</li>
              <li><strong>Notifications:</strong> a push token for your device and your notification preferences.</li>
              <li><strong>Consents and legal acceptances:</strong> which versions of our Terms and Privacy Policy you accepted, and optional-processing consents.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><span className="text-rose-600 dark:text-rose-400 font-mono">3.</span> How We Use Your Data and Who Processes It</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li>To run the service: show your profile to eligible members, find matches, deliver messages and notifications, and connect calls.</li>
              <li>To keep members safe: enforce 18+, review photos, handle reports, and suspend accounts that break the Community Guidelines. Staff access to member data is restricted to authorized moderators and administrators, and their actions are logged.</li>
              <li>To process purchases and restore your entitlements.</li>
              <li>To comply with law and respond to valid legal requests.</li>
            </ul>
            <p>We use these service providers: <strong>Supabase</strong> (database, authentication, file storage, server functions), <strong>Google Cloud Vision SafeSearch</strong> (automated photo moderation), <strong>Agora</strong> (real-time voice/video calls), and <strong>Google Play</strong> (billing). Their handling of data is governed by their own terms. Chahat does not itself record call audio or video, and we do not claim that calls are end-to-end encrypted.</p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><span className="text-rose-600 dark:text-rose-400 font-mono">4.</span> Your Rights, Account Deletion and Retention</h2>
            <p>You can edit your profile in the app. You can permanently delete your account in the app (Settings) or from our <Link href="/delete-account" className="text-rose-600 dark:text-rose-400 font-medium underline">account deletion page</Link>, where you sign in to prove ownership. Both use the same deletion process.</p>
            <p><strong>Deleted:</strong> profile, photos and verification selfies, matches, likes, blocks, messages and chat media (messages also disappear for the other person), location data, push tokens and notification settings, call records, coin balance and ledger, legal-acceptance and consent records, and your sign-in account.</p>
            <p><strong>Retained, in reduced or anonymised form:</strong> reports made about or by you (your identity is replaced by a one-way identifier, but report notes may remain), anonymised audit events showing that a deletion occurred, and payment records for purchases (detached from your account). These are kept for safety, dispute and accounting purposes. We have not yet published fixed retention periods for these records.</p>
            <p>Deleting your account does not cancel a Google Play subscription; cancel it in Google Play. Signed image links may keep working until they expire (up to one hour). If you cannot sign in, contact us using the details below and we will help you.</p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><span className="text-rose-600 dark:text-rose-400 font-mono">5.</span> Security</h2>
            <p>Data is transmitted over HTTPS and stored with Supabase using row-level access controls so members can only read data they are entitled to. Administrative actions require a server-verified staff role and are recorded in an audit log. No system is perfectly secure and we cannot guarantee absolute security.</p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-mono">6.</span> Grievance Officer Contact
            </h2>
            <p>
              In compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, our designated Grievance Officer may be reached at:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
              <p><strong className="text-slate-900 dark:text-white">Designation:</strong> Grievance Redressal Officer</p>
              <p><strong className="text-slate-900 dark:text-white">Organization:</strong> Chahat Friendship App Operations</p>
              <p><strong className="text-slate-900 dark:text-white">Email:</strong> <a href="mailto:milodating2026@gmail.com" className="text-rose-600 dark:text-rose-400 hover:underline">milodating2026@gmail.com</a></p>
              <p><strong className="text-slate-900 dark:text-white">Registered Address:</strong> Bodhi Chhapra A.D.O Tola, Gaithihaw Mus. Ghithihaw Aht., PO: Gethihawa, Dist: Kushinagar, Uttar Pradesh, 274802, India</p>
              <p><strong className="text-slate-900 dark:text-white">Turnaround Time:</strong> Acknowledged within 24 hours; resolved within 15 days.</p>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
