import type { Meal } from '@/lib/meals/schema';

export function MealCard({
  label,
  meal,
  note,
  emphasis = false,
}: {
  label: string;
  meal?: Meal;
  note?: string;
  emphasis?: boolean;
}) {
  return (
    <section
      className={
        emphasis
          ? 'rounded-2xl border border-accent-orange/40 bg-background-secondary p-4'
          : 'rounded-2xl border border-border-subtle bg-background-secondary p-4'
      }
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">{label}</p>
        {meal?.proteinG && <p className="text-xs font-medium text-accent-orange-light">{meal.proteinG} protein</p>}
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
    </section>
  );
}
