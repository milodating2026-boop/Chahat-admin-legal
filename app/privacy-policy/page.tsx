'use client';

import React from 'react';
import Link from 'next/link';
import { LegalShell, Section, Bullets, Note, DataTable, strong, link } from '@/components/legal/LegalDoc';
import { APP_NAME, OPERATOR } from '@/lib/legal';

export default function PrivacyPolicyPage() {
  return (
    <LegalShell
      badge="Legal &amp; Compliance"
      title="Privacy Policy"
      subtitle="What Chahat collects, why, who processes it, how long it is kept, and how you can delete it."
      crumb="Privacy Policy"
    >
      <Section n={1} title="Who we are and what this policy covers">
        <p>
          This policy applies to the <strong className={strong}>{APP_NAME}</strong> for Android (package{' '}
          <span className="font-mono">com.chahat.dating</span>) and this website (&ldquo;Chahat&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;). The service is operated by <strong className={strong}>{OPERATOR.name}</strong>, {OPERATOR.address}.
          Contact: <a href={`mailto:${OPERATOR.email}`} className={link}>{OPERATOR.email}</a>.
        </p>
        <p>
          Chahat is for adults aged 18 and over. Some features (for example voice and video calls, subscriptions, coins,
          voice messages and push notifications) are switched on per app version and may not be available to you yet. This
          policy describes the data handling built into the app; where a feature is not available in your version, the
          related data is not collected.
        </p>
        <p>
          India&rsquo;s Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025 were notified in November 2025; the
          Rules bring most obligations on organisations into force in stages, with the main duties applying from 13 May 2027.
          We are building toward them and will update this policy as they take effect. Nothing on this page is a statement
          that Chahat is already certified or fully compliant with any law.
        </p>
      </Section>

      <Section n={2} title="Information we collect">
        <DataTable
          head={['What', 'Details', 'When']}
          rows={[
            ['Account', 'Email address and password (handled by Supabase Authentication) or Google sign-in. Your session is kept on your device.', 'Sign-up and login'],
            ['Profile', 'Name, date of birth (used to enforce 18+; only your age is shown to others), gender, who you want to meet, relationship intents, city, bio, work, education, interests, languages, lifestyle and prompt answers.', 'You enter it'],
            ['Photos and voice intro', 'Profile photos and an optional short voice introduction. The app removes embedded location (EXIF/GPS) metadata from photos before upload.', 'You upload it'],
            ['Verification selfie', 'If you choose to verify, a selfie you take is stored and reviewed by our team.', 'Optional'],
            ['Location', 'With your permission, your device location is read only while the app is open. Our server rounds it to a grid of roughly 1 km before storing and does not keep the exact point. Other members see only an approximate distance. You can hide your distance or remove the stored location in Settings.', 'Optional, consent recorded'],
            ['Messages', 'Text, replies, reactions, photos (including view-once photos) and voice messages you send. Photos and voice files are stored in cloud storage; the other person can read what you send.', 'When you chat'],
            ['Activity', 'Likes, passes, matches, blocks, reports you make or that are made about you, and daily usage limits.', 'While you use the app'],
            ['Calls', 'A record of each call: participants, type (voice/video), status, timestamps and duration, and any coin charge. Chahat does not record call audio or video.', 'When you call'],
            ['Purchases', 'Subscriptions and coin purchases go through Google Play. We store order id, product, amount, dates, a hash of the purchase token, your plan and your coin balance and ledger. We do not receive your card or UPI details.', 'When you buy'],
            ['Notifications', 'A device push token and your notification choices (including what may show on the lock screen: nothing, sender name, or a short preview).', 'Optional, consent recorded'],
            ['Consents and acceptances', 'Which versions of the Terms and this policy you accepted and when, and your choices for location and push.', 'Sign-up, prompts'],
          ]}
        />
        <p>
          <strong className={strong}>Sensitive context.</strong> On a dating-style service, details such as who you want to
          meet and your photos can reveal sensitive personal information. Share only what you are comfortable with.
        </p>
        <p>
          <strong className={strong}>Not collected by the app:</strong> your phone number, contacts, call log, SMS, precise
          location history, government ID documents, or an advertising ID. The app contains no advertising or third-party
          analytics/crash-reporting SDKs. (Our hosting and service providers may keep ordinary technical logs, such as IP
          address and timestamps, to run and secure their services.)
        </p>
        <p>
          <strong className={strong}>Device permissions the app requests:</strong> camera (selfie and photos), photos/media
          (to pick pictures), microphone (voice messages and calls), location while in use (discovery), Bluetooth connect
          (headsets during calls), notifications, and vibration. You can refuse or revoke any of them in your device settings;
          the features that need them will then be unavailable, but discovery by city, likes, matches and chat remain.
        </p>
      </Section>

      <Section n={3} title="Why we use your information">
        <Bullets
          items={[
            'To run the service: create your account, show your profile to eligible members, find matches, deliver messages, send notifications and connect calls.',
            'To keep members safe: enforce the 18+ rule, screen photos, handle reports and blocks, and suspend accounts that break the Community Guidelines. Staff access is limited to authorised moderators and administrators, and their actions are logged.',
            'To process purchases, verify them with Google Play, apply your entitlements and charge call minutes.',
            'To meet legal duties and respond to valid legal requests, and to keep proof that you accepted our Terms and this policy.',
          ]}
        />
        <p>
          Location and push notifications are optional and each is switched on only after a separate, plain-language prompt
          that we record. You can withdraw either at any time in Settings (this deletes the stored location or the device
          token). We do not sell your personal data and do not use it for advertising.
        </p>
      </Section>

      <Section n={4} title="Who sees or processes your data">
        <p>
          <strong className={strong}>Other members</strong> see your profile information, photos, approximate distance and
          what you send them. <strong className={strong}>Our staff</strong> (moderators and admins) can see what is needed to
          review reports, photos and verification selfies.
        </p>
        <p>
          <strong className={strong}>Service providers</strong> process data on our behalf. Their handling is governed by
          their own terms and privacy policies:
        </p>
        <DataTable
          head={['Provider', 'Used for', 'Data involved']}
          rows={[
            ['Supabase', 'Database, authentication, file storage and server functions', 'Everything you store in the app'],
            ['Google Cloud Vision (SafeSearch)', 'Automated screening of profile photos', 'The photo image'],
            ['Google Sign-In', 'Optional login with Google', 'Your Google account identity (email, name)'],
            ['Agora', 'Real-time voice/video transport', 'Call audio/video stream and connection data, with your user id'],
            ['Expo push service and Google Firebase Cloud Messaging', 'Delivering Android push notifications', 'Your push token and the notification text'],
            ['Google Play (Billing and Developer API)', 'Subscriptions and coin purchases, purchase verification', 'Purchase token, product, order details'],
          ]}
        />
        <p>
          Calls are carried by Agora; they are not end-to-end encrypted and Chahat does not record them. We may disclose data
          to authorities where the law requires or to protect people from harm.
        </p>
        <Note>
          <p><strong className={strong}>Transfers outside India.</strong> These providers may process data on servers outside India. We have not yet confirmed each provider&rsquo;s processing locations; this list will be updated when we do.</p>
        </Note>
      </Section>

      <Section n={5} title="How long we keep data, and what account deletion does">
        <p>
          You can delete your account in the app (Settings) or on our{' '}
          <Link href="/delete-account" className={link}>account deletion page</Link>, where you sign in to prove ownership.
          Both run the same process, which removes the data below and finally your sign-in account.
        </p>
        <DataTable
          head={['Data', 'On deletion']}
          rows={[
            ['Profile, photos, verification selfies, voice intro', 'Deleted'],
            ['Matches, likes, passes, blocks', 'Deleted'],
            ['Messages and chat media (photos, voice)', 'Deleted, including for the other person in your current matches'],
            ['Location and discovery settings', 'Deleted'],
            ['Push tokens and notification settings', 'Deleted'],
            ['Call records', 'Deleted (this also removes the other person\u2019s history of those calls)'],
            ['Coin balance and ledger', 'Deleted; unspent coins are lost'],
            ['Terms/Privacy acceptance and consent records', 'Deleted with the account'],
            ['Reports made about or by you', 'Kept; your identity is replaced by a pseudonymous identifier (a hash of your account ID, which is not anonymous because it can be recomputed by anyone who already knows that ID) and free-text report notes may remain'],
            ['Payment records for subscriptions (order id, token hash, amount, dates)', 'Kept, detached from your account'],
            ['Pseudonymised record that a deletion happened', 'Kept'],
          ]}
        />
        <p>
          <strong className={strong}>Retention periods.</strong> We have not yet set fixed retention periods for the records we
          keep after deletion (reports, payment records, deletion record). We keep them only for safety, dispute handling,
          accounting and legal purposes, and will publish the periods here once decided. Access to them is limited to
          administrators.
        </p>
        <p>
          <strong className={strong}>Limits you should know about.</strong> Deleting your account does not cancel a Google Play
          subscription: cancel it in Google Play. Image links already issued can keep working until they expire (up to one
          hour). Messages you deleted for everyone are blanked immediately and their files are removed by a clean-up process.
          Files from chats that ended by unmatching or blocking may not yet be cleaned up automatically. We have not verified
          whether our database host keeps backups that hold deleted data for a limited time; if it does, deleted data can
          remain in those backups until they expire. If you cannot sign in, email us and we will help you.
        </p>
      </Section>

      <Section n={6} title="Your choices and rights">
        <p>
          You can edit your profile, hide your distance, remove your stored location, turn notifications off, delete messages
          for yourself or for everyone, block and report members, and delete your account in the app. Under the DPDP Act you
          may also ask to access, correct or erase your personal data, withdraw consent, and nominate someone to exercise your
          rights if you die or become incapable. Write to{' '}
          <a href={`mailto:${OPERATOR.email}`} className={link}>{OPERATOR.email}</a>. We have not yet fixed a response time for
          privacy requests and will state it here once decided. If you are unhappy with our answer, you can use our grievance
          process below and, once it is operating, approach the Data Protection Board of India.
        </p>
      </Section>

      <Section n={7} title="Children">
        <p>
          Chahat is for people aged 18 and over. The server rejects a date of birth that makes the member under 18, but age is
          self-declared and we do not check government ID. If we learn that a member is under 18, we suspend the account and
          delete it. See our <Link href="/child-safety" className={link}>child safety standards</Link>.
        </p>
      </Section>

      <Section n={8} title="Security">
        <p>
          Data travels over HTTPS and is stored with Supabase using row-level access rules so members can read only what they
          are entitled to. Photos are served through short-lived signed links. Staff actions are audit-logged. On Android,
          conversation screens block screenshots and screen recording. No system is perfectly secure and we cannot guarantee
          absolute security. If a personal data breach occurs we will notify affected people and authorities as the law requires.
        </p>
      </Section>

      <Section n={9} title="Changes to this policy">
        <p>
          We will post updates here with a new date. The app records which version of the Terms and this policy you accepted,
          and may ask you to accept a new version.
        </p>
      </Section>

      <Section n={10} title="Grievance Officer">
        <p>
          In line with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules,
          2021, complaints about content, accounts or your data can be sent to:
        </p>
        <Note>
          <p><strong className={strong}>Designation:</strong> {OPERATOR.grievanceOfficerDesignation}</p>
          <p><strong className={strong}>Organization:</strong> {OPERATOR.name}</p>
          <p><strong className={strong}>Email:</strong> <a href={`mailto:${OPERATOR.email}`} className={link}>{OPERATOR.email}</a></p>
          <p><strong className={strong}>Address:</strong> {OPERATOR.address}</p>
          <p><strong className={strong}>Timelines:</strong> acknowledged {OPERATOR.grievanceAcknowledge}; resolved {OPERATOR.grievanceResolve}.</p>
        </Note>
      </Section>
    </LegalShell>
  );
}
