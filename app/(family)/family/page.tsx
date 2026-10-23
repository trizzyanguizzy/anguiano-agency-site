import Link from 'next/link';
import { BellIcon, CartIcon, Logo, MealsIcon, SnowflakeIcon, SwapIcon } from '@/components/family/icons';
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
      <header className="mb-7">
        <div className="mb-5 flex items-center gap-3">
          <Logo size={40} />
          <p className="text-sm text-foreground-tertiary">
            {weekdayName(today)}, {shortDate(today)}
          </p>
        </div>
        <h1 className="text-[2.5rem]">{greeting(chicagoHour())}</h1>
      </header>

      <section aria-labelledby="today" className="mb-8">
        <h2 id="today" className="mb-2.5 text-sm font-medium text-foreground-tertiary">
          Today
        </h2>
        {day ? (
          <div className="grid grid-cols-2 gap-3">
            {(['lunch', 'dinner'] as const).map((slot) => {
              const meal = day[slot];
              const isDinner = slot === 'dinner';
              return (
                <Link
                  key={slot}
                  href={`/family/meals/${today}/${slot}`}
                  className={`flex min-h-[7.5rem] flex-col rounded-[1.1rem] border bg-background-secondary p-4 transition-colors active:bg-background-tertiary ${
                    isDinner ? 'border-accent/70 ring-1 ring-inset ring-accent/40' : 'border-border-default'
                  }`}
                >
                  <p className="text-[0.8125rem] text-foreground-tertiary">{isDinner ? 'Dinner at 5' : 'Lunch at 11'}</p>
                  <p className="mt-1 text-[1.0625rem] font-semibold leading-snug text-foreground-primary">
                    {meal?.title ?? 'Nothing planned'}
                  </p>
                  {meal?.proteinG && (
                    <p className="mt-auto pt-2 text-[0.8125rem] text-accent-light">
                      {meal.proteinG.replace(/^~/, '')} protein
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="rounded-[1.1rem] border border-border-default bg-background-secondary p-4 text-foreground-secondary">
            No meals planned for today.
          </p>
        )}
        {tonight.length > 0 && (
          <div className="mt-3 flex gap-3 rounded-[1.1rem] border border-brass/30 bg-brass/[0.07] p-4">
            <SnowflakeIcon className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
            <div>
              <p className="font-medium">Tonight</p>
              <ul className="mt-0.5 space-y-0.5 text-foreground-secondary">
                {tonight.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <section aria-labelledby="sections">
        <h2 id="sections" className="mb-2.5 text-sm font-medium text-foreground-tertiary">
          Family
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Tile href="/family/meals" icon={MealsIcon} title="Meals" detail={week ? 'This week’s plan' : 'No plan yet'} />
          <Tile
            href="/family/meals/groceries"
            icon={CartIcon}
            title="Groceries"
            detail={groceriesLeft === null ? 'Hy-Vee list' : groceriesLeft === 0 ? 'All bought' : `${groceriesLeft} to buy`}
          />
          <Tile href="/family/meals/edit" icon={SwapIcon} title="Rearrange" detail="Swap meals between days" />
          <Tile href="/family/settings" icon={BellIcon} title="Reminders" detail="Notifications and devices" />
        </div>
      </section>
    </main>
  );
}

function Tile({
  href,
  icon: Icon,
  title,
  detail,
}: {
  href: string;
  icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[7rem] flex-col justify-between rounded-[1.1rem] border border-border-default bg-background-secondary p-4 transition-colors active:bg-background-tertiary"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/10 text-accent-light">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-foreground-tertiary">{detail}</span>
      </span>
    </Link>
  );
}
