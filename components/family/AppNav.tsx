'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CartIcon, HomeIcon, MealsIcon, SettingsIcon } from './icons';

type Tab = { href: string; label: string; icon: React.ReactNode; match: (p: string) => boolean };

/** Bottom tab bar. Add a tab here when a new section of the app is ready. */
const TABS: Tab[] = [
  {
    href: '/family',
    label: 'Home',
    match: (p) => p === '/family',
    icon: <HomeIcon className="h-6 w-6" />,
  },
  {
    href: '/family/meals',
    label: 'Meals',
    match: (p) => p.startsWith('/family/meals') && !p.startsWith('/family/meals/groceries'),
    icon: <MealsIcon className="h-6 w-6" />,
  },
  {
    href: '/family/meals/groceries',
    label: 'Groceries',
    match: (p) => p.startsWith('/family/meals/groceries'),
    icon: <CartIcon className="h-6 w-6" />,
  },
  {
    href: '/family/settings',
    label: 'Settings',
    match: (p) => p.startsWith('/family/settings'),
    icon: <SettingsIcon className="h-6 w-6" />,
  },
];

export function AppNav() {
  const pathname = usePathname() ?? '/';
  if (pathname === '/family/login') return null;
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-background-secondary/95 backdrop-blur-md"
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
