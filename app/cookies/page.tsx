'use client';

import React from 'react';
import Link from 'next/link';
import { LegalShell, Section, DataTable, Note, strong, link } from '@/components/legal/LegalDoc';

export default function CookiesPage() {
  return (
    <LegalShell
      badge="Data Protection"
      title="Cookies &amp; Tracking Policy"
      subtitle="What this website stores in your browser and what it does not."
      crumb="Cookies Policy"
    >
      <Section n={1} title="Summary">
        <p>
          We checked this website&rsquo;s code. It <strong className={strong}>does not set cookies</strong>, and it does not load
          advertising, analytics, tracking pixels, social-media widgets, external fonts or any other third-party scripts. It
          stores two things in your browser&rsquo;s local storage, both strictly necessary to work as you asked. Because nothing
          else is stored, there is no cookie banner to accept.
        </p>
      </Section>

      <Section n={2} title="What is stored in your browser">
        <DataTable
          head={['Name', 'Purpose', 'When it is set', 'Lifetime']}
          rows={[
            [<span key="a" className="font-mono">chahat_theme_mode</span>, 'Remembers your light / dark / system display choice.', 'When you change the theme', 'Until you clear site data'],
            [<span key="b" className="font-mono">sb-…-auth-token (Supabase)</span>, 'Keeps you signed in on the account-deletion page and the staff admin console, so the page can act for you.', 'Only if you sign in on those pages', 'Until you sign out (the admin console also signs out after 30 minutes idle) or clear site data'],
          ]}
        />
        <p>
          Neither item is shared with advertisers or used to follow you across sites. Use your browser settings to clear site
          data at any time; the theme will reset and you will be signed out.
        </p>
      </Section>

      <Section n={3} title="What we do not use">
        <p>
          No advertising or behavioural-tracking cookies, no analytics or session-replay tools, no fingerprinting and no data
          brokers. If we ever add any of these we will update this page first and, where required, ask for your consent
          before using them.
        </p>
      </Section>

      <Section n={4} title="Server logs and hosting">
        <Note>
          <p>
            Like any website, the servers that deliver it (including our hosting provider) receive technical details with each
            request, such as IP address, browser type and time, and may keep logs to run and secure the site. We have not
            reviewed the hosting provider&rsquo;s own logging or cookie practices; see its privacy policy for details.
          </p>
        </Note>
      </Section>

      <Section n={5} title="The Android app">
        <p>
          The mobile app does not use browser cookies. It keeps your sign-in session on your device (in secure storage where available) and
          contains no advertising or third-party analytics SDKs. What the app collects is described in the{' '}
          <Link href="/privacy-policy" className={link}>Privacy Policy</Link>.
        </p>
      </Section>
    </LegalShell>
  );
}
