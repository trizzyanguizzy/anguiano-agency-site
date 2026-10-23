import Link from 'next/link';
import { WeekEditor, type Cell, type Row } from '@/components/meals/WeekEditor';
import { getSwaps } from '@/lib/meals/effective';
import { getCurrentWeek, weeks } from '@/lib/meals/plan';
import { getRedis } from '@/lib/family/redis';
import { applySwaps, position } from '@/lib/meals/swaps';
import { chicagoDate, shortDate, weekdayName } from '@/lib/family/time';

export const dynamic = 'force-dynamic';
export const metadata = { title: { absolute: 'Rearrange · Meals' } };

export default async function EditWeekPage() {
  const today = chicagoDate();
  const base = getCurrentWeek(today, weeks);

  if (!base) {
    return (
      <main>
        <Link href="/family/meals" className="text-sm text-foreground-secondary">
          ← Week
        </Link>
        <p className="mt-4 text-foreground-secondary">No meal plan to rearrange yet.</p>
      </main>
    );
  }

  const swaps = await getSwaps(base.weekId);
  const week = applySwaps(base, swaps);

  const rows: Row[] = week.days.map((d) => ({
    date: d.date,
    weekday: weekdayName(d.date, 'short'),
    dayLabel: shortDate(d.date).replace(/^\w+ /, ''),
    isToday: d.date === today,
  }));

  const cells: Record<string, Cell> = {};
  for (const d of week.days) {
    for (const slot of ['lunch', 'dinner'] as const) {
      const pos = position(d.date, slot);
      const meal = d[slot];
      cells[pos] = {
        pos,
        date: d.date,
        slot,
        title: meal?.title ?? null,
        proteinG: meal?.proteinG,
        origin: swaps[pos] ?? pos,
        locked: d.date < today,
      };
    }
  }

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/family/meals" className="text-sm text-foreground-secondary">
          ← Week
        </Link>
        <Link href="/family/meals" className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-background-primary">
          Done
        </Link>
      </div>
      <h1 className="mb-2 text-3xl font-semibold">Rearrange</h1>
      <WeekEditor weekId={week.weekId} rows={rows} initialCells={cells} storageReady={!!getRedis()} />
    </main>
  );
}
