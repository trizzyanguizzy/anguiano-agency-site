import type { Metadata, Viewport } from 'next';
import { Figtree, Newsreader } from 'next/font/google';
import { AppNav } from '@/components/family/AppNav';
import { ServiceWorkerRegistrar } from '@/components/family/ServiceWorkerRegistrar';
import { TimeZoneSync } from '@/components/family/TimeZoneSync';

const display = Newsreader({ subsets: ['latin'], weight: ['500'], variable: '--font-display', display: 'swap' });
const body = Figtree({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Anguiano', template: '%s · Anguiano' },
  description: 'The Anguiano family app',
  manifest: '/family-assets/manifest.webmanifest',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  appleWebApp: { capable: true, title: 'Anguiano', statusBarStyle: 'default' },
  icons: {
    icon: [{ url: '/family-assets/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/family-assets/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: null,
  twitter: null,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EEF0EB' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1714' },
  ],
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
};

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className={`family-theme ${display.variable} ${body.variable} mx-auto min-h-screen w-full max-w-lg px-5`}
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))',
        }}
      >
        <ServiceWorkerRegistrar />
        <TimeZoneSync />
        {children}
        <AppNav />
      </div>
    </>
  );
}
