'use client';

import React from 'react';
import Link from 'next/link';
import { LegalShell, Section, Bullets, strong, link } from '@/components/legal/LegalDoc';
import { OPERATOR } from '@/lib/legal';

export default function CommunityGuidelinesPage() {
  return (
    <LegalShell
      badge="Community Standards"
      title="Community Guidelines"
      subtitle="The values of respect, consent and safety that every Chahat member agrees to uphold."
      crumb="Community Guidelines"
    >
      <Section n={1} title="Treat everyone with respect">
        <p>
          Chahat is for adults (18+) to build friendships and connections. Be kind and courteous. We welcome people of all
          backgrounds, languages and cultures across India.
        </p>
      </Section>

      <Section n={2} title="Respect boundaries and consent">
        <p>
          If someone does not want to keep chatting or sharing photos or voice messages, stop immediately. Repeated
          unwanted messages, pressure or aggressive demands can lead to suspension.
        </p>
      </Section>

      <Section n={3} title="Be real">
        <Bullets
          items={[
            'Use your own photos and honest details. No impersonation, catfishing or fake accounts.',
            'Do not ask anyone for money, gifts, UPI transfers, bank details or cryptocurrency, and do not pretend to be in an emergency.',
            'No advertising, promotion or selling of products or services.',
          ]}
        />
      </Section>

      <Section n={4} title="Zero tolerance">
        <p>These lead to suspension or removal and, where the law requires, a report to the authorities:</p>
        <Bullets
          items={[
            <span key="1"><strong className={strong}>Child sexual abuse and exploitation (CSAE).</strong> Any sexual or exploitative content, grooming, solicitation or sexualised reference involving anyone under 18 is banned. See our <Link href="/child-safety" className={link}>Child Safety Standards</Link>.</span>,
            <span key="2"><strong className={strong}>Non-consensual sexual content.</strong> Unsolicited explicit images, sextortion, or threats to share private media.</span>,
            <span key="3"><strong className={strong}>Sexual services and compensated arrangements.</strong> Escort or sex-for-payment offers and any arrangement where money or gifts are expected in return for companionship or sex.</span>,
            <span key="4"><strong className={strong}>Hate and harassment.</strong> Content that attacks people for religion, caste, race, ethnicity, disability, gender or sexual orientation, and stalking, threats or intimidation.</span>,
            <span key="5"><strong className={strong}>Scams and extortion.</strong> Romance scams, fake emergencies, blackmail and fraud.</span>,
            <span key="6"><strong className={strong}>Illegal activity.</strong> Trafficking, drugs, weapons or any unlawful content or conduct.</span>,
          ]}
        />
      </Section>

      <Section n={5} title="Photos and private content">
        <p>
          Profile photos must show you and must not contain nudity, minors other than as incidental background, violence or
          others&rsquo; private information. Photos are screened by an automated service.
          Do not record, screenshot or share other members&rsquo; private chats or photos without their consent.
        </p>
      </Section>

      <Section n={6} title="Block and report">
        <p>
          Use Block to stop someone contacting you and Report on a profile or conversation to flag a problem. You can also
          write to <a href={`mailto:${OPERATOR.email}`} className={link}>{OPERATOR.email}</a>. Reports go to our moderation
          team, who may remove content, restrict features or suspend accounts. We do not publish a fixed warning or strike
          schedule, and serious violations can lead to immediate suspension.
        </p>
      </Section>

      <Section n={7} title="Enforcement and review">
        <p>
          Suspended accounts cannot message or use paid features while suspended. If you think we made a mistake, email us
          with the details and we will look again; accounts can be restored where we find an error. Complaints can also go to
          our Grievance Officer as described in the{' '}
          <Link href="/privacy-policy" className={link}>Privacy Policy</Link>.
        </p>
      </Section>
    </LegalShell>
  );
}
