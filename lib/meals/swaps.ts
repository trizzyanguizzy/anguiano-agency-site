import type { Day, WeekPlan } from './schema';

export type MealSlot = 'lunch' | 'dinner';
export const MEAL_SLOTS: readonly MealSlot[] = ['lunch', 'dinner'];

/** A meal position in the week, e.g. "2026-10-23:dinner". */
export type Position = `${string}:${MealSlot}`;

/**
 * Where each position's meal comes from in the original plan: { target: source }.
 * Positions that show their original meal are left out, so an empty map = the plan as written.
 */
export type SwapMap = Partial<Record<Position, Position>>;

export function position(date: string, slot: MealSlot): Position {
  return `${date}:${slot}`;
}

export function parsePosition(pos: string): { date: string; slot: MealSlot } | null {
  const m = /^(\d{4}-\d{2}-\d{2}):(lunch|dinner)$/.exec(pos);
  return m ? { date: m[1], slot: m[2] as MealSlot } : null;
}

/** Every lunch and dinner position in the week. */
export function weekPositions(week: WeekPlan): Set<Position> {
  return new Set(week.days.flatMap((d) => MEAL_SLOTS.map((s) => position(d.date, s))));
}

/** Drops entries that point outside the week, cross slot types, or map a position to itself. */
export function normalize(map: SwapMap, week: WeekPlan): SwapMap {
  const valid = weekPositions(week);
  const out: SwapMap = {};
  for (const [target, source] of Object.entries(map) as Array<[Position, Position]>) {
    const t = parsePosition(target);
    const s = parsePosition(source);
    if (!t || !s || !valid.has(target) || !valid.has(source)) continue;
    if (t.slot !== s.slot || target === source) continue;
    out[target] = source;
  }
  return out;
}

/** Swaps whatever is currently shown at `a` and `b`. Both must be the same meal type. */
export function swap(map: SwapMap, a: Position, b: Position, week: WeekPlan): SwapMap {
  const pa = parsePosition(a);
  const pb = parsePosition(b);
  const valid = weekPositions(week);
  if (!pa || !pb || pa.slot !== pb.slot || !valid.has(a) || !valid.has(b)) {
    throw new Error('Can only swap a lunch with a lunch, or a dinner with a dinner, within the same week.');
  }
  if (a === b) return normalize(map, week);
  const sourceA = map[a] ?? a;
  const sourceB = map[b] ?? b;
  return normalize({ ...map, [a]: sourceB, [b]: sourceA }, week);
}

/** The week as it should be shown: each position gets the meal from its source position. */
export function applySwaps(week: WeekPlan, map: SwapMap): WeekPlan {
  const clean = normalize(map, week);
  if (Object.keys(clean).length === 0) return week;
  const byDate = new Map(week.days.map((d) => [d.date, d]));
  const mealAt = (pos: Position) => {
    const p = parsePosition(pos)!;
    return byDate.get(p.date)?.[p.slot];
  };
  const days: Day[] = week.days.map((day) => ({
    ...day,
    lunch: mealAt(clean[position(day.date, 'lunch')] ?? position(day.date, 'lunch')),
    dinner: mealAt(clean[position(day.date, 'dinner')] ?? position(day.date, 'dinner')) as Day['dinner'],
  }));
  return { ...week, days };
}
