import Link from 'next/link';
import { SwapIcon } from '@/components/family/icons';
import { MealCard } from '@/components/meals/MealCard';
import { getEffectiveWeeks } from '@/lib/meals/effective';
import { getCurrentWeek, getDay } from '@/lib/meals/plan';
import { addDays, chicagoDate, shortDate, weekdayName } from '@/lib/family/time';

export const dynamic = 'force-dynamic';

export default async function MealsHome() {
  const plan = await getEffectiveWeeks();
  const today = chicagoDate();
  const day = getDay(today, plan);
  const tomorrow = getDay(addDays(today, 1), plan);
  const week = getCurrentWeek(today, plan);

  const tonight = [
    ...(tomorrow?.dinner?.fromFreezer ?? []).map((item) => `Move ${item} from freezer to fridge`),
    ...(day?.dinner?.prepTonight ?? []),
  ];
  const upcoming = (week?.days ?? []).filter((d) => d.date > today);

  return (
    <main>
      <header className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-foreground-tertiary">
            {weekdayName(today)}, {shortDate(today)}
          </p>
          <h1 className="text-[2.25rem]">This week</h1>
        </div>
        {week && (
          <Link
            href="/family/meals/edit"
            className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-border-default bg-background-secondary px-3.5 py-1.5 text-sm text-foreground-secondary active:bg-background-tertiary"
          >
            <SwapIcon className="h-4 w-4" />
            Rearrange
          </Link>
        )}
      </header>

      {day ? (
        <div className="flex flex-col gap-3">
          <MealCard label="Lunch at 11" meal={day.lunch} href={`/family/meals/${today}/lunch`} />
          <MealCard
            label="Dinner at 5"
            meal={day.dinner}
            note={day.dinner?.startCookingNote}
            href={`/family/meals/${today}/dinner`}
            emphasis
          />
          {tonight.length > 0 && (
            <section className="rounded-2xl border border-border-subtle bg-background-tertiary p-4">
              <p className="text-sm font-medium text-foreground-tertiary">Tonight</p>
              <ul className="mt-2 space-y-1">
                {tonight.map((t) => (
                  <li key={t} className="text-foreground-primary">
                    🧊 {t}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      ) : (
        <section className="rounded-2xl border border-border-subtle bg-background-secondary p-4">
          <h2 className="text-xl font-semibold">No plan for today</h2>
          <p className="mt-1 text-foreground-secondary">
            Plan the week with Claude, add the file to <code className="font-mono text-sm">content/meals/</code>, and
            push.
          </p>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Coming up</h2>
          <ul className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-background-secondary">
            {upcoming.map((d) => (
              <li key={d.date}>
                <Link href={`/family/meals/${d.date}/dinner`} className="block px-4 pb-1 pt-3 active:bg-background-tertiary">
                  <p className="text-sm font-medium text-foreground-tertiary">
                    {weekdayName(d.date)}, {shortDate(d.date)}
                  </p>
                  <p className="mt-0.5 font-medium">
                    {d.dinner?.title ?? 'No dinner planned'}
                    {d.dinner?.recipe && <span className="ml-1 text-accent-light">›</span>}
                  </p>
                </Link>
                {d.lunch ? (
                  <Link
                    href={`/family/meals/${d.date}/lunch`}
                    className="block px-4 pb-3 text-sm text-foreground-secondary active:bg-background-tertiary"
                  >
                    Lunch: {d.lunch.title}
                  </Link>
                ) : (
                  <div className="pb-3" />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {week && week.notes.length > 0 && (
        <section className="mt-8 space-y-1 text-sm text-foreground-tertiary">
          {week.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </section>
      )}
    </main>
  );
}
