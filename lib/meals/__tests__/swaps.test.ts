import { describe, expect, it } from 'vitest';
import seed from '@/content/meals/2026-10-22.json';
import { WeekPlan } from '../schema';
import { applySwaps, normalize, swap, type SwapMap } from '../swaps';
import { getDay } from '../plan';

const week = WeekPlan.parse(seed);
const titleAt = (w: WeekPlan, date: string, slot: 'lunch' | 'dinner') => getDay(date, [w])?.[slot]?.title;

describe('meal swaps', () => {
  it('an empty map leaves the week untouched', () => {
    expect(applySwaps(week, {})).toBe(week);
  });

  it('swaps two dinners, carrying their recipe, groceries, and freezer notes along', () => {
    const map = swap({}, '2026-10-23:dinner', '2026-10-24:dinner', week);
    const out = applySwaps(week, map);
    expect(titleAt(out, '2026-10-23', 'dinner')).toBe('Homemade beef chili');
    expect(titleAt(out, '2026-10-24', 'dinner')).toBe('Filet mignon');
    const fri = getDay('2026-10-23', [out])!.dinner!;
    expect(fri.fromFreezer).toEqual(['Ground beef (1.5 lb)']);
    expect(fri.recipe?.steps.length).toBeGreaterThan(0);
    // Lunches on those days are unchanged.
    expect(titleAt(out, '2026-10-23', 'lunch')).toBe('Tuna & avocado');
    expect(titleAt(out, '2026-10-24', 'lunch')).toBe('Turkey & cheese sandwiches');
  });

  it('swapping the same pair twice restores the original plan', () => {
    let map: SwapMap = swap({}, '2026-10-22:lunch', '2026-10-28:lunch', week);
    map = swap(map, '2026-10-22:lunch', '2026-10-28:lunch', week);
    expect(map).toEqual({});
  });

  it('chains swaps based on what is currently shown', () => {
    // Thu ↔ Fri, then Fri (now cod) ↔ Sat: Thu=filet, Fri=chili, Sat=cod.
    let map = swap({}, '2026-10-22:dinner', '2026-10-23:dinner', week);
    map = swap(map, '2026-10-23:dinner', '2026-10-24:dinner', week);
    const out = applySwaps(week, map);
    expect(titleAt(out, '2026-10-22', 'dinner')).toBe('Filet mignon');
    expect(titleAt(out, '2026-10-23', 'dinner')).toBe('Homemade beef chili');
    expect(titleAt(out, '2026-10-24', 'dinner')).toBe('Lemon garlic butter cod');
    // Every dinner still appears exactly once.
    const dinners = out.days.map((d) => d.dinner?.title).sort();
    expect(dinners).toEqual(week.days.map((d) => d.dinner?.title).sort());
  });

  it('refuses to mix lunches and dinners or leave the week', () => {
    expect(() => swap({}, '2026-10-22:lunch', '2026-10-23:dinner', week)).toThrow();
    expect(() => swap({}, '2026-10-22:dinner', '2026-11-30:dinner', week)).toThrow();
  });

  it('ignores stale or tampered stored entries', () => {
    const bad = {
      '2026-10-22:dinner': '2026-10-22:lunch',
      '2026-12-01:dinner': '2026-10-22:dinner',
      '2026-10-23:lunch': '2026-10-23:lunch',
    } as SwapMap;
    expect(normalize(bad, week)).toEqual({});
  });
});
