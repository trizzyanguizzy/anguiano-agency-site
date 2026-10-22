import { describe, expect, it } from 'vitest';
import seed from '@/content/meals/2026-10-22.json';
import { WeekPlan } from '../schema';
import { addDays, chicagoDate, chicagoHour } from '../time';
import { buildMessage, TARGET_HOUR } from '../messages';
import { getDay, grocerySections } from '../plan';

const week = WeekPlan.parse(seed);
const day = (date: string) => getDay(date, [week]);

describe('chicago time helpers', () => {
  it('uses CDT (UTC-5) before Nov 1, 2026', () => {
    const t = new Date('2026-10-31T15:30:00Z');
    expect(chicagoHour(t)).toBe(10);
    expect(chicagoDate(t)).toBe('2026-10-31');
  });

  it('uses CST (UTC-6) after Nov 1, 2026', () => {
    const t = new Date('2026-11-02T16:30:00Z');
    expect(chicagoHour(t)).toBe(10);
  });

  it('rolls the date back for late-evening UTC times', () => {
    // 01:30 UTC Oct 23 is 8:30pm Oct 22 in Chicago.
    const t = new Date('2026-10-23T01:30:00Z');
    expect(chicagoDate(t)).toBe('2026-10-22');
    expect(chicagoHour(t)).toBe(20);
  });

  it('adds days across month boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
});

describe('cron schedules', () => {
  // Mirrors vercel.json: each slot has a CDT and a CST UTC hour. Exactly one should hit the target.
  const schedules = { lunch: [15, 16], dinner: [20, 21], thaw: [1, 2] } as const;
  const dates = { cdt: '2026-10-22', cst: '2026-11-05' };

  for (const [slot, utcHours] of Object.entries(schedules)) {
    for (const [zone, date] of Object.entries(dates)) {
      it(`${slot} fires exactly once on a ${zone} day`, () => {
        const hits = utcHours.filter((h) => {
          // thaw runs after midnight UTC, i.e. the next UTC day
          const utcDate = h < 12 ? addDays(date, 1) : date;
          const t = new Date(`${utcDate}T${String(h).padStart(2, '0')}:20:00Z`);
          return chicagoHour(t) === TARGET_HOUR[slot as keyof typeof TARGET_HOUR] && chicagoDate(t) === date;
        });
        expect(hits).toHaveLength(1);
      });
    }
  }
});

describe('seed plan', () => {
  it('validates and covers Thu Oct 22 through Wed Oct 28', () => {
    expect(week.days.map((d) => d.date)).toEqual([
      '2026-10-22',
      '2026-10-23',
      '2026-10-24',
      '2026-10-25',
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
    ]);
  });

  it('groups groceries by meal in order, with extras last', () => {
    const sections = grocerySections(week);
    expect(sections[0].key).toBe('2026-10-22-lunch');
    expect(sections.at(-1)?.key).toBe('extras');
  });

  it('rejects duplicate grocery ids', () => {
    const bad = structuredClone(seed);
    bad.extras.push({ id: 'tuna', name: 'More tuna' });
    expect(WeekPlan.safeParse(bad).success).toBe(false);
  });
});

describe('buildMessage', () => {
  it('lunch lists the items', () => {
    const msg = buildMessage('lunch', day('2026-10-22'), day('2026-10-23'));
    expect(msg?.title).toBe('Lunch: Tuna & avocado');
    expect(msg?.body).toContain('Crackers');
  });

  it('dinner includes protein and the start-cooking note', () => {
    const msg = buildMessage('dinner', day('2026-10-23'), day('2026-10-24'));
    expect(msg?.title).toBe('Tonight: Filet mignon');
    expect(msg?.body).toContain('~60g protein');
    expect(msg?.body).toContain('Boil the potatoes');
  });

  it('thaw on Friday names the chili beef for Saturday', () => {
    const msg = buildMessage('thaw', day('2026-10-23'), day('2026-10-24'));
    expect(msg?.title).toBe('Freezer → fridge tonight');
    expect(msg?.body).toContain('Ground beef (1.5 lb)');
    expect(msg?.body).toContain('Homemade beef chili');
  });

  it('thaw on Monday combines tomorrow’s shrimp and tonight’s chicken prep', () => {
    const msg = buildMessage('thaw', day('2026-10-26'), day('2026-10-27'));
    expect(msg?.body).toContain('Shrimp (1 lb)');
    expect(msg?.body).toContain('Slice and fridge half the chicken');
  });

  it('thaw is skipped when there is nothing to move or prep', () => {
    // Thursday night → Friday filet: nothing frozen, no prep.
    expect(buildMessage('thaw', day('2026-10-22'), day('2026-10-23'))).toBeNull();
  });

  it('thaw nags to plan when tomorrow has no plan', () => {
    const msg = buildMessage('thaw', day('2026-10-28'), undefined);
    expect(msg?.title).toBe('No meal plan for tomorrow');
  });

  it('lunch and dinner are skipped on days with no plan', () => {
    expect(buildMessage('lunch', undefined, undefined)).toBeNull();
    expect(buildMessage('dinner', undefined, undefined)).toBeNull();
  });
});
