import { MealsNav } from '@/components/meals/MealsNav';
import { MealCard } from '@/components/meals/MealCard';
import { getCurrentWeek, getDay } from '@/lib/meals/plan';
import { addDays, chicagoDate, shortDate, weekdayName } from '@/lib/meals/time';

export const dynamic = 'force-dynamic';

export default function MealsHome() {
  const today = chicagoDate();
  const day = getDay(today);
  const tomorrow = getDay(addDays(today, 1));
  const week = getCurrentWeek(today);

  const tonight = [
    ...(tomorrow?.dinner?.fromFreezer ?? []).map((item) => `Move ${item} from freezer to fridge`),
    ...(day?.dinner?.prepTonight ?? []),
  ];
  const upcoming = (week?.days ?? []).filter((d) => d.date > today);

  return (
    <main>
      <MealsNav active="/meals" />

      <header className="mb-4">
        <p className="text-sm text-foreground-tertiary">{shortDate(today)}</p>
        <h1 className="text-3xl font-semibold">{weekdayName(today)}</h1>
      </header>

      {day ? (
        <div className="flex flex-col gap-3">
          <MealCard label="Lunch · 11:00" meal={day.lunch} />
          <MealCard label="Dinner · 5–6" meal={day.dinner} note={day.dinner?.startCookingNote} emphasis />
          {tonight.length > 0 && (
            <section className="rounded-2xl border border-border-subtle bg-background-tertiary p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">Tonight</p>
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
              <li key={d.date} className="px-4 py-3">
                <p className="text-sm font-medium text-foreground-tertiary">
                  {weekdayName(d.date)} · {shortDate(d.date)}
                </p>
                <p className="mt-0.5 font-medium">{d.dinner?.title ?? 'No dinner planned'}</p>
                {d.lunch && <p className="text-sm text-foreground-secondary">Lunch: {d.lunch.title}</p>}
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
