import { rawWeeks } from '@/content/meals';
import { WeekPlan, type Day, type GroceryItem } from './schema';
import { addDays, chicagoDate } from './time';

function loadWeeks(): WeekPlan[] {
  return rawWeeks
    .map((raw, i) => {
      const parsed = WeekPlan.safeParse(raw);
      if (!parsed.success) {
        throw new Error(`Invalid meal plan #${i}: ${parsed.error.issues.map((x) => x.message).join('; ')}`);
      }
      return parsed.data;
    })
    .sort((a, b) => a.weekId.localeCompare(b.weekId));
}

export const weeks: WeekPlan[] = loadWeeks();

export function getDay(date: string, source: WeekPlan[] = weeks): Day | undefined {
  // Later weeks win if two plans overlap.
  for (let i = source.length - 1; i >= 0; i--) {
    const day = source[i].days.find((d) => d.date === date);
    if (day) return day;
  }
  return undefined;
}

export function getWeekContaining(date: string, source: WeekPlan[] = weeks): WeekPlan | undefined {
  for (let i = source.length - 1; i >= 0; i--) {
    if (source[i].days.some((d) => d.date === date)) return source[i];
  }
  return undefined;
}

/** The week to show: the one containing today, else the next upcoming one, else the most recent. */
export function getCurrentWeek(today: string = chicagoDate(), source: WeekPlan[] = weeks): WeekPlan | undefined {
  return (
    getWeekContaining(today, source) ??
    source.find((w) => w.days[0].date > today) ??
    source[source.length - 1]
  );
}

export function getToday(now = new Date()) {
  const date = chicagoDate(now);
  return { date, day: getDay(date) };
}

export function getTomorrow(now = new Date()) {
  const date = addDays(chicagoDate(now), 1);
  return { date, day: getDay(date) };
}

export type GrocerySection = { key: string; date?: string; label: string; meal?: string; items: GroceryItem[] };

/** Groceries grouped by day → meal, in the order the meals happen, then extras. */
export function grocerySections(week: WeekPlan): GrocerySection[] {
  const sections: GrocerySection[] = [];
  for (const day of week.days) {
    for (const slot of ['lunch', 'dinner'] as const) {
      const meal = day[slot];
      if (meal && meal.groceries.length > 0) {
        sections.push({
          key: `${day.date}-${slot}`,
          date: day.date,
          label: slot === 'lunch' ? 'Lunch' : 'Dinner',
          meal: meal.title,
          items: meal.groceries,
        });
      }
    }
  }
  if (week.extras.length > 0) sections.push({ key: 'extras', label: 'Extras', items: week.extras });
  return sections;
}
