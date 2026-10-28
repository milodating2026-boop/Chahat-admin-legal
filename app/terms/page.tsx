'use client';

import React from 'react';
import Link from 'next/link';
import { LegalShell, Section, Bullets, strong, link } from '@/components/legal/LegalDoc';
import { APP_NAME, OPERATOR } from '@/lib/legal';

export default function TermsPage() {
  return (
    <LegalShell
      badge="Legal Agreement"
      title="Terms &amp; Conditions"
      subtitle="The rules and obligations that apply to your membership and use of Chahat."
      crumb="Terms & Conditions"
    >
      <Section n={1} title="Who these Terms are with, and acceptance">
        <p>
          These Terms are an agreement between you and <strong className={strong}>{OPERATOR.name}</strong> ({OPERATOR.address})
          (&ldquo;Chahat&rdquo;, &ldquo;we&rdquo;) for the {APP_NAME} on Android and this website (the &ldquo;Service&rdquo;). By
          creating an account, ticking the acceptance box at sign-up or using the Service you agree to these Terms, our{' '}
          <Link href="/privacy-policy" className={link}>Privacy Policy</Link>, our{' '}
          <Link href="/community-guidelines" className={link}>Community Guidelines</Link> and our{' '}
          <Link href="/child-safety" className={link}>Child Safety Standards</Link>. If you do not agree, do not use the Service.
          This is an electronic record and needs no physical signature.
        </p>
      </Section>

      <Section n={2} title="Eligibility (18+ only)">
        <p>
          You must be at least 18 and legally able to enter a contract. You confirm that the date of birth you give is true.
          We may suspend or remove any account we reasonably believe belongs to someone under 18, or that was opened with false
          information. You must not use the Service if you are barred by law from doing so.
        </p>
      </Section>

      <Section n={3} title="Your account">
        <Bullets
          items={[
            'Keep your login secure and tell us promptly if you suspect misuse. You are responsible for activity on your account.',
            'One person, one account. Do not create accounts for others or impersonate anyone.',
            'Keep your profile accurate. Photos must be of you.',
            'You can delete your account at any time in the app or on our account deletion page; see the Privacy Policy for what is deleted and kept.',
          ]}
        />
      </Section>

      <Section n={4} title="What the Service is, and its limits">
        <p>
          Chahat helps adults meet and chat. We do not run background checks, do not verify members&rsquo; identity
          documents, and cannot promise that any member is who they say they are or will behave well. A verified badge,
          where offered, rests on an optional selfie and is not a guarantee. Be careful with personal details and money, and take
          normal precautions before meeting anyone in person. Some features (such as subscriptions, voice
          messages and notifications) may be unavailable, limited, changed or withdrawn at any time.
        </p>
      </Section>

      <Section n={5} title="Your content and our licence to it">
        <p>
          You own what you post (photos, voice intro, messages, profile text). You give us a non-exclusive, worldwide,
          royalty-free licence to store, process, display and deliver it for the purpose of running and securing the Service,
          for as long as it is on the Service. You confirm you have the rights to post it and that it does not breach the law or
          anyone&rsquo;s rights. Photos are screened automatically and may be rejected or removed.
        </p>
      </Section>

      <Section n={6} title="Rules of conduct">
        <p>You must follow the Community Guidelines. In particular, you must not:</p>
        <Bullets
          items={[
            'post or send nudity, sexually explicit content, non-consensual or intimate images, or ask for or offer sexual services or compensated arrangements;',
            'harass, threaten, stalk, blackmail, or keep contacting someone who has asked you to stop;',
            'impersonate others, use fake photos, or ask members for money, gifts, cryptocurrency or financial details;',
            'create, share, solicit or promote any content that sexualises or endangers anyone under 18, or contact minors;',
            'screenshot, record or share other members\u2019 private chats or photos without their consent, or try to get around the app\u2019s protections;',
            'scrape, copy, reverse engineer or interfere with the Service, use bots, or promote products or services;',
            'break any law, or post unlawful, hateful or defamatory content.',
          ]}
        />
      </Section>

      <Section n={7} title="Safety, moderation and enforcement">
        <p>
          Members can block and report others in the app. We review reports and may remove content, restrict features,
          suspend or end accounts, and refer matters to the authorities where the law requires. We may act without prior
          notice where we think it necessary to protect people or the Service; where practicable we will tell you why and you
          can write to us to ask for a review. A suspended account is not entitled to use the Service while suspended.
        </p>
      </Section>

      <Section n={8} title="Paid features">
        <Bullets
          items={[
            'Paid plans are sold through Google Play and are governed by Google Play\u2019s billing terms. Prices, plans and what each plan includes are shown in the app before you buy.',
            'Paid plans are prepaid for a fixed period (1 week, 1 month or 2 months). They do not renew automatically and you are never charged again unless you buy another plan. Your plan ends on the date shown in the app. Buying the same plan again before it ends adds to it.',
            'Deleting your Chahat account ends any active plan.',
            'Refunds are handled under Google Play\u2019s refund policies and applicable consumer law. This does not limit any rights you have by law.',
            'If an account is ended for breaking these Terms, unused paid benefits may be forfeited to the extent the law allows.',
          ]}
        />
      </Section>

      <Section n={9} title="Third-party services">
        <p>
          The Service relies on third parties such as Supabase, Google (Play, Sign-In, Cloud Vision) and Expo. We are not
          responsible for third-party services outside our control, but we will act on problems we are told about.
        </p>
      </Section>

      <Section n={10} title="Our role as an intermediary and takedown">
        <p>
          Chahat hosts content created by members and acts as an intermediary under the Information Technology Act, 2000 and
          the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. We act on unlawful content when we have
          actual knowledge, including by court or government order, and on complaints sent to our Grievance Officer (see the
          Privacy Policy). Report unlawful content or conduct in the app or at{' '}
          <a href={`mailto:${OPERATOR.email}`} className={link}>{OPERATOR.email}</a>.
        </p>
      </Section>

      <Section n={11} title="Disclaimers and limits of liability">
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the extent permitted by law, we do not
          promise it will be uninterrupted or error-free, and we are not liable for the conduct of members, for meetings
          between members, or for indirect or consequential loss. Nothing in these Terms excludes liability that cannot be
          excluded by law, or limits your statutory rights as a consumer.
        </p>
      </Section>

      <Section n={12} title="Ending your use">
        <p>
          You may stop using the Service and delete your account at any time. We may suspend or end your access for breach of
          these Terms, for legal reasons, or if we stop offering the Service. Sections that by their nature should continue
          (such as content licence for removal, liability and governing law) continue after your account ends.
        </p>
      </Section>

      <Section n={13} title="Changes, law and contact">
        <p>
          We may update these Terms; the date above shows the latest version, and the app may ask you to accept a new version.
          If you keep using the Service after a change you accept it, but where a change is material we will ask for your
          fresh acceptance. These Terms are governed by the laws of India and the courts in India have jurisdiction. If any
          part is held unenforceable the rest continues. Questions and complaints:{' '}
          <a href={`mailto:${OPERATOR.email}`} className={link}>{OPERATOR.email}</a>.
        </p>
      </Section>
    </LegalShell>
  );
}
