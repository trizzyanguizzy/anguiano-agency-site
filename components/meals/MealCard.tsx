import Link from 'next/link';
import type { Meal } from '@/lib/meals/schema';

export function MealCard({
  label,
  meal,
  note,
  emphasis = false,
  href,
}: {
  label: string;
  meal?: Meal;
  note?: string;
  emphasis?: boolean;
  /** When set, the whole card links to the meal's recipe page. */
  href?: string;
}) {
  const className = emphasis
    ? 'block rounded-2xl border border-accent/40 bg-background-secondary p-4'
    : 'block rounded-2xl border border-border-subtle bg-background-secondary p-4';
  const body = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">{label}</p>
        {meal?.proteinG && <p className="text-xs font-medium text-accent-light">{meal.proteinG} protein</p>}
      </div>
      {meal ? (
        <>
          <h3 className="mt-1 text-xl font-semibold leading-snug">{meal.title}</h3>
          {meal.items.length > 0 && (
            <p className="mt-1 text-foreground-secondary">{meal.items.join(' · ')}</p>
          )}
          {note && <p className="mt-3 text-sm text-foreground-secondary">⏱ {note}</p>}
        </>
      ) : (
        <p className="mt-1 text-foreground-tertiary">Nothing planned</p>
      )}
      {href && meal?.recipe && (
        <p className="mt-3 text-sm font-medium text-accent-light">View recipe →</p>
      )}
    </>
  );
  return href && meal ? (
    <Link href={href} className={`${className} transition-colors active:bg-background-tertiary`}>
      {body}
    </Link>
  ) : (
    <section className={className}>{body}</section>
  );
}
