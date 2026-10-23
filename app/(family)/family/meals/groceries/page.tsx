import { GroceryList } from '@/components/meals/GroceryList';
import { getEffectiveWeeks } from '@/lib/meals/effective';
import { getCurrentWeek, grocerySections } from '@/lib/meals/plan';
import { getRedis, keys } from '@/lib/family/redis';
import { shortDate, weekdayName } from '@/lib/family/time';

export const dynamic = 'force-dynamic';

export default async function GroceriesPage() {
  const week = getCurrentWeek(undefined, await getEffectiveWeeks());
  if (!week) {
    return (
      <main>
        <p className="text-foreground-secondary">No meal plan yet.</p>
      </main>
    );
  }

  const redis = getRedis();
  const checked = redis ? Object.keys((await redis.hgetall<Record<string, string>>(keys.grocery(week.weekId))) ?? {}) : [];

  const sections = grocerySections(week).map((s) => ({
    ...s,
    heading: s.date ? `${weekdayName(s.date, 'short')} ${s.label.toLowerCase()} · ${s.meal}` : s.label,
  }));
  const first = week.days[0].date;
  const last = week.days[week.days.length - 1].date;

  return (
    <main>
      <header className="mb-4">
        <h1 className="text-3xl font-semibold">Groceries</h1>
        <p className="text-sm text-foreground-tertiary">
          {shortDate(first)} – {shortDate(last)}
        </p>
      </header>
      <GroceryList weekId={week.weekId} sections={sections} initialChecked={checked} synced={!!redis} />
    </main>
  );
}
