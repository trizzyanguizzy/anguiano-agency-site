'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Tab = { href: string; label: string; icon: React.ReactNode; match: (p: string) => boolean };

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Bottom tab bar. Add a tab here when a new section of the app is ready. */
const TABS: Tab[] = [
  {
    href: '/family',
    label: 'Home',
    match: (p) => p === '/family',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    href: '/family/meals',
    label: 'Meals',
    match: (p) => p.startsWith('/family/meals') && !p.startsWith('/family/meals/groceries'),
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10" />
        <path d="M17 21V3c-2.2 0-4 2.5-4 6s1.8 5 4 5" />
      </svg>
    ),
  },
  {
    href: '/family/meals/groceries',
    label: 'Groceries',
    match: (p) => p.startsWith('/family/meals/groceries'),
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M3 4h2.5l2.2 11h10.6L20.5 7H6.4" />
        <circle cx="9.5" cy="19.5" r="1.2" />
        <circle cx="17" cy="19.5" r="1.2" />
      </svg>
    ),
  },
  {
    href: '/family/settings',
    label: 'Settings',
    match: (p) => p.startsWith('/family/settings'),
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
      </svg>
    ),
  },
];

export function AppNav() {
  const pathname = usePathname() ?? '/';
  if (pathname === '/family/login') return null;
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-background-primary/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-lg">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-0.5 pb-2 pt-2.5 text-[11px] font-medium',
                  active ? 'text-accent-light' : 'text-foreground-tertiary'
                )}
              >
                {tab.icon}
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
