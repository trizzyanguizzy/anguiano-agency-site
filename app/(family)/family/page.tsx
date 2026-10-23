import Link from 'next/link';
import { getEffectiveWeeks } from '@/lib/meals/effective';
import { getCurrentWeek, getDay, grocerySections } from '@/lib/meals/plan';
import { getRedis, keys } from '@/lib/family/redis';
import { addDays, chicagoDate, chicagoHour, shortDate, weekdayName } from '@/lib/family/time';

export const dynamic = 'force-dynamic';

function greeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function Home() {
  const plan = await getEffectiveWeeks();
  const today = chicagoDate();
  const day = getDay(today, plan);
  const tomorrow = getDay(addDays(today, 1), plan);
  const week = getCurrentWeek(today, plan);

  // Groceries still to buy this week (for the tile).
  let groceriesLeft: number | null = null;
  if (week) {
    const items = grocerySections(week).flatMap((s) => s.items).filter((i) => !i.have);
    const redis = getRedis();
    const checked = redis ? await redis.hgetall<Record<string, string>>(keys.grocery(week.weekId)) : null;
    groceriesLeft = items.filter((i) => !checked?.[i.id]).length;
  }

  const tonight = [
    ...(tomorrow?.dinner?.fromFreezer ?? []).map((item) => `Move ${item} to the fridge`),
    ...(day?.dinner?.prepTonight ?? []),
  ];

  return (
    <main>
      <header className="mb-6">
        <p className="text-sm text-foreground-tertiary">
          {weekdayName(today)}, {shortDate(today)}
        </p>
        <h1 className="text-3xl font-semibold">{greeting(chicagoHour())}</h1>
      </header>

      <section aria-labelledby="today" className="mb-8">
        <h2 id="today" className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">
          Today
        </h2>
        {day ? (
          <div className="grid grid-cols-2 gap-3">
            {(['lunch', 'dinner'] as const).map((slot) => {
              const meal = day[slot];
              return (
                <Link
                  key={slot}
                  href={`/family/meals/${today}/${slot}`}
                  className={`rounded-2xl border bg-background-secondary p-4 active:bg-background-tertiary ${
                    slot === 'dinner' ? 'border-accent/40' : 'border-border-subtle'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">
                    {slot === 'lunch' ? 'Lunch · 11' : 'Dinner · 5–6'}
                  </p>
                  <p className="mt-1 font-semibold leading-snug text-foreground-primary">{meal?.title ?? 'Nothing planned'}</p>
                  {meal?.proteinG && <p className="mt-1 text-xs text-accent-light">{meal.proteinG} protein</p>}
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-border-subtle bg-background-secondary p-4 text-foreground-secondary">
            No meals planned for today.
          </p>
        )}
        {tonight.length > 0 && (
          <div className="mt-3 rounded-2xl border border-border-subtle bg-background-tertiary p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">Tonight</p>
            <ul className="mt-1.5 space-y-1">
              {tonight.map((t) => (
                <li key={t}>🧊 {t}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section aria-labelledby="sections">
        <h2 id="sections" className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">
          Family
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Tile href="/family/meals" emoji="🍽️" title="Meals" detail={week ? 'This week’s plan' : 'No plan yet'} />
          <Tile
            href="/family/meals/groceries"
            emoji="🛒"
            title="Groceries"
            detail={groceriesLeft === null ? 'Hy-Vee list' : groceriesLeft === 0 ? 'All bought' : `${groceriesLeft} to buy`}
          />
          <Tile href="/family/meals/edit" emoji="⇅" title="Rearrange" detail="Swap meals between days" />
          <Tile href="/family/settings" emoji="🔔" title="Reminders" detail="Notifications & devices" />
        </div>
      </section>
    </main>
  );
}

function Tile({ href, emoji, title, detail }: { href: string; emoji: string; title: string; detail: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-[6.5rem] flex-col justify-between rounded-2xl border border-border-subtle bg-background-secondary p-4 active:bg-background-tertiary"
    >
      <span aria-hidden className="text-2xl leading-none">
        {emoji}
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-foreground-tertiary">{detail}</span>
      </span>
    </Link>
  );
}
