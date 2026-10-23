import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CookMode } from '@/components/meals/CookMode';
import { IngredientList } from '@/components/meals/IngredientList';
import { getEffectiveWeeks } from '@/lib/meals/effective';
import { getDay } from '@/lib/meals/plan';
import type { Step } from '@/lib/meals/schema';
import { shortDate, weekdayName } from '@/lib/family/time';

export const dynamic = 'force-dynamic';

const SLOTS = { lunch: 'Lunch', dinner: 'Dinner' } as const;

export async function generateMetadata({ params }: { params: Promise<{ date: string; slot: string }> }) {
  const { date, slot } = await params;
  const meal = slot in SLOTS ? getDay(date, await getEffectiveWeeks())?.[slot as keyof typeof SLOTS] : undefined;
  return { title: { absolute: meal ? `${meal.title} · Meals` : 'Meals' } };
}

/** Groups consecutive steps under their heading while keeping one running step number. */
function groupSteps(steps: Step[]) {
  const groups: Array<{ heading?: string; steps: Array<Step & { n: number }> }> = [];
  steps.forEach((step, i) => {
    const last = groups[groups.length - 1];
    if (last && last.heading === step.group) last.steps.push({ ...step, n: i + 1 });
    else groups.push({ heading: step.group, steps: [{ ...step, n: i + 1 }] });
  });
  return groups;
}

export default async function MealPage({ params }: { params: Promise<{ date: string; slot: string }> }) {
  const { date, slot } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !(slot in SLOTS)) notFound();
  const meal = getDay(date, await getEffectiveWeeks())?.[slot as keyof typeof SLOTS];
  if (!meal) notFound();
  const recipe = meal.recipe;

  const stats = [
    meal.proteinG && `${meal.proteinG} protein`,
    recipe?.servings && `Serves ${recipe.servings}`,
    recipe?.prepMinutes !== undefined && `${recipe.prepMinutes} min prep`,
    recipe?.cookMinutes !== undefined && recipe.cookMinutes > 0 && `${recipe.cookMinutes} min cook`,
  ].filter(Boolean) as string[];

  return (
    <main>
      <Link href="/family/meals" className="mb-4 inline-flex items-center gap-1 text-sm text-foreground-secondary">
        ← Week
      </Link>

      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">
          {weekdayName(date)} {shortDate(date)} · {SLOTS[slot as keyof typeof SLOTS]}
        </p>
        <h1 className="mt-1 text-3xl font-semibold leading-tight">{meal.title}</h1>
        {meal.items.length > 0 && <p className="mt-1 text-foreground-secondary">{meal.items.join(' · ')}</p>}
        {stats.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {stats.map((s) => (
              <li
                key={s}
                className="rounded-full border border-border-subtle bg-background-secondary px-3 py-1 text-xs text-foreground-secondary"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </header>

      {!recipe ? (
        <p className="rounded-2xl border border-border-subtle bg-background-secondary p-4 text-foreground-secondary">
          No recipe for this one yet.
        </p>
      ) : (
        <>
          <CookMode />

          {recipe.ingredients.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-2 text-lg font-semibold">Ingredients</h2>
              <IngredientList ingredients={recipe.ingredients} storageKey={`meals:ingredients:${date}:${slot}`} />
            </section>
          )}

          <section className="mt-8">
            <h2 className="mb-2 text-lg font-semibold">Steps</h2>
            <div className="flex flex-col gap-5">
              {groupSteps(recipe.steps).map((group, gi) => (
                <div key={`${group.heading ?? 'steps'}-${gi}`}>
                  {group.heading && (
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">
                      {group.heading}
                    </h3>
                  )}
                  <ol className="flex flex-col gap-3">
                    {group.steps.map((step) => (
                      <li key={step.n} className="flex gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background-tertiary text-sm font-semibold text-accent-light">
                          {step.n}
                        </span>
                        <div className="flex-1">
                          <p className="text-[1.0625rem] leading-relaxed text-foreground-primary">{step.text}</p>
                          {step.minutes && <p className="mt-1 text-sm text-foreground-tertiary">⏱ {step.minutes} min</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          {recipe.tips.length > 0 && (
            <section className="mt-8 rounded-2xl border border-border-subtle bg-background-tertiary p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">Tips</h2>
              <ul className="mt-2 space-y-2">
                {recipe.tips.map((t) => (
                  <li key={t} className="text-foreground-secondary">
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}
