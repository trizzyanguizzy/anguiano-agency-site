import type { Metadata, Viewport } from 'next';
import { AppNav } from '@/components/family/AppNav';
import { ServiceWorkerRegistrar } from '@/components/family/ServiceWorkerRegistrar';
import { TimeZoneSync } from '@/components/family/TimeZoneSync';

export const metadata: Metadata = {
  title: { default: 'Anguiano', template: '%s · Anguiano' },
  description: 'The Anguiano family app',
  manifest: '/family-assets/manifest.webmanifest',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  appleWebApp: { capable: true, title: 'Anguiano', statusBarStyle: 'black-translucent' },
  icons: {
    icon: [{ url: '/family-assets/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/family-assets/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: null,
  twitter: null,
};

export const viewport: Viewport = {
  themeColor: '#131314',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
};

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className="mx-auto min-h-screen w-full max-w-lg px-4"
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))',
        }}
      >
        <ServiceWorkerRegistrar />
        <TimeZoneSync />
        {children}
      </div>
      <AppNav />
    </>
  );
}
