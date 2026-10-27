'use client';

import React from 'react';
import Link from 'next/link';
import { LegalShell, Section, Bullets, Note, strong, link } from '@/components/legal/LegalDoc';
import { OPERATOR } from '@/lib/legal';

export default function ChildSafetyPage() {
  return (
    <LegalShell
      badge="Child Safety"
      title="Child Safety Standards"
      subtitle="Our published standards against child sexual abuse and exploitation (CSAE) on Chahat."
      crumb="Child Safety Standards"
    >
      <Section n={1} title="Our position">
        <p>
          Chahat is an adults-only service (18+). We prohibit child sexual abuse and exploitation (CSAE) in every form on our
          platform, including child sexual abuse material (CSAM), grooming, sexualised content or conversation involving a
          minor, sextortion of minors, and any attempt to contact or meet minors for sexual or exploitative purposes. This
          standard applies to profiles, photos, voice intros, messages, voice messages and reports.
        </p>
      </Section>

      <Section n={2} title="How we try to keep minors off Chahat">
        <Bullets
          items={[
            'Members must be 18 or over; the date of birth entered at sign-up is checked by our servers and under-18 dates are rejected. Age is self-declared and we do not check government ID.',
            'Profile photos are screened by an automated image-moderation service, and our team reviews reports.',
            'Accounts we suspect belong to someone under 18 are suspended and, once confirmed, removed.',
          ]}
        />
      </Section>

      <Section n={3} title="Reporting">
        <Bullets
          items={[
            'In the app, use Report on a profile or conversation. You can also block the member.',
            <span key="e">By email: <a href={`mailto:${OPERATOR.childSafetyContactEmail}`} className={link}>{OPERATOR.childSafetyContactEmail}</a> (our designated child safety point of contact).</span>,
            <span key="l">If a child is in danger, contact the local police at once. In India you can also report online abuse at <span className="font-mono">cybercrime.gov.in</span> and reach Childline on <span className="font-mono">1098</span>.</span>,
          ]}
        />
      </Section>

      <Section n={4} title="What we do when we find it">
        <Bullets
          items={[
            'Remove the content and suspend or remove the account.',
            'Keep the report record and report to the competent authorities, including as required under Indian law such as the Protection of Children from Sexual Offences Act, 2012 and the Information Technology Act, 2000. A report records the reporter, the reported member, a category and note, where in the app it was made (profile or chat) and the time. It does not automatically include a copy of the conversation, and messages are removed when a match ends.',
            'Respond to lawful requests from law enforcement and to notifications from Google Play.',
          ]}
        />
        <Note>
          <p>
            <strong className={strong}>Child safety point of contact:</strong> {OPERATOR.name},{' '}
            <a href={`mailto:${OPERATOR.childSafetyContactEmail}`} className={link}>{OPERATOR.childSafetyContactEmail}</a>.
            See also our <Link href="/community-guidelines" className={link}>Community Guidelines</Link> and{' '}
            <Link href="/terms" className={link}>Terms</Link>.
          </p>
        </Note>
      </Section>
    </LegalShell>
  );
}
