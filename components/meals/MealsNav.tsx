import Link from 'next/link';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/meals', label: 'Week' },
  { href: '/meals/groceries', label: 'Groceries' },
  { href: '/meals/settings', label: 'Reminders' },
] as const;

export function MealsNav({ active }: { active: (typeof tabs)[number]['href'] }) {
  return (
    <nav aria-label="Meals" className="mb-6 flex gap-1 rounded-xl border border-border-subtle bg-background-secondary p-1">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={active === t.href ? 'page' : undefined}
          className={cn(
            'flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors',
            active === t.href
              ? 'bg-background-tertiary text-foreground-primary'
              : 'text-foreground-secondary hover:text-foreground-primary'
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
