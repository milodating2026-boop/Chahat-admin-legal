// Landing page for shared Chahat profile links: https://chahatlegal.netlify.app/p/<member-id>
// Shared from the app (Me → Share my profile, or the share button on a profile).
//
// With Chahat installed and Android App Links verified (public/.well-known/assetlinks.json), Android opens the app
// straight away and this page is never shown. Otherwise it offers "Open in Chahat" and Google Play.
// PRIVACY: this page never fetches or shows any profile data (name, photo, city, age). It only knows the id, and the
// profile is shown only inside the app to signed-in members, under the normal visibility and block rules.
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.chahat.dating';
const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const metadata: Metadata = {
  title: 'View this profile on Chahat',
  description: 'Open the Chahat app to view this profile.',
  robots: { index: false, follow: false },
  openGraph: { title: 'View this profile on Chahat', description: 'Open the Chahat app to view this profile.' },
};

export default async function SharedProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appUrl = ID_PATTERN.test(id) ? `chahat://p/${id.toLowerCase()}` : 'chahat://';
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <PublicHeader />
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 text-center space-y-5">
        <h1 className="text-2xl font-extrabold">Someone shared a Chahat profile</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Profiles are only visible inside the Chahat app, to signed-in members aged 18 and over.
        </p>
        <a
          href={appUrl}
          className="inline-block px-6 py-3 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
        >
          Open in Chahat
        </a>
        <p>
          <a href={PLAY_URL} className="text-sm font-semibold text-rose-700 dark:text-rose-300 underline">
            Get Chahat on Google Play
          </a>
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
