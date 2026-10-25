import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'Chahat — Online Friendship App | Real People, Real Connections',
  description: 'Chahat is a social app for adult friendships, 1-on-1 voice and video calls, and chat across India.',
  openGraph: {
    title: 'Chahat — Online Friendship App',
    description: 'Real adult friendship and safe conversations across India.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chahat — Online Friendship App',
    description: 'Real adult friendship and safe conversations across India.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('chahat_theme_mode');
                  var isDark = false;
                  if (saved === 'dark') {
                    isDark = true;
                  } else if (saved === 'light') {
                    isDark = false;
                  } else {
                    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  }
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-rose-500/20 selection:text-rose-900 min-h-screen transition-colors duration-150 font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
