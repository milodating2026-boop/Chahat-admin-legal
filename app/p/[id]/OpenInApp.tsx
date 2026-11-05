'use client';
import { useEffect } from 'react';

/** On Android, tries to open the Chahat app straight away (no tap needed). The button below stays as a fallback. */
export function OpenInApp({ href }: { href: string }) {
  useEffect(() => {
    if (!/android/i.test(navigator.userAgent)) return;
    const t = setTimeout(() => { window.location.href = href; }, 150);
    return () => clearTimeout(t);
  }, [href]);
  return null;
}
