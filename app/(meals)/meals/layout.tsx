import type { Metadata, Viewport } from 'next';
import { ServiceWorkerRegistrar } from '@/components/meals/ServiceWorkerRegistrar';
import { TimeZoneSync } from '@/components/meals/TimeZoneSync';

export const metadata: Metadata = {
  title: { absolute: 'Meals' },
  description: 'Household meal plan',
  manifest: '/meals-assets/manifest.webmanifest',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  appleWebApp: { capable: true, title: 'Meals', statusBarStyle: 'black-translucent' },
  icons: {
    icon: [{ url: '/meals-assets/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/meals-assets/apple-touch-icon.png', sizes: '180x180' }],
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

export default function MealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-auto min-h-screen w-full max-w-lg px-4 pb-12"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(3rem, env(safe-area-inset-bottom))',
      }}
    >
      <ServiceWorkerRegistrar />
      <TimeZoneSync />
      {children}
    </div>
  );
}
