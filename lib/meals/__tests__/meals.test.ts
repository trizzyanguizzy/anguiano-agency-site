import { describe, expect, it } from 'vitest';
import seed from '@/content/meals/2026-10-22.json';
import { WeekPlan } from '../schema';
import { addDays, chicagoDate, chicagoHour, localHour } from '../time';
import { deviceTimeZone, dueReminders } from '../reminders';
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

describe('per-device reminder schedule', () => {
  const zones = ['America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/New_York', 'America/Phoenix'];
  const targets = { lunch: 11, dinner: 17, thaw: 21 } as const;

  it('targets lunch 11, dinner 5pm, freezer 9pm local', () => {
    expect(TARGET_HOUR).toEqual(targets);
  });

  // vercel.json runs a tick at minute 0 of every UTC hour; Hobby may deliver it any time that hour.
  for (const tz of zones) {
    for (const date of ['2026-10-22', '2026-11-01', '2026-11-05', '2027-03-14']) {
      it(`${tz} on ${date}: each reminder fires once, in its local hour`, () => {
        const seen: Record<string, string[]> = { lunch: [], dinner: [], thaw: [] };
        // Walk 24 UTC hours that cover the local day, at a jittered minute.
        for (let h = 0; h < 30; h++) {
          const now = new Date(Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8)), h, 37));
          for (const due of dueReminders(now, [{ id: 'd1', timeZone: tz }])) {
            if (due.date !== date) continue;
            expect(localHour(now, tz)).toBe(targets[due.slot]);
            seen[due.slot].push(now.toISOString());
          }
        }
        expect(seen.lunch).toHaveLength(1);
        expect(seen.dinner).toHaveLength(1);
        expect(seen.thaw).toHaveLength(1);
      });
    }
  }

  it('sends to each device by its own clock', () => {
    // 18:30 UTC on Oct 22 = 1:30pm Chicago, 12:30pm Denver, 11:30am Los Angeles.
    const now = new Date('2026-10-22T18:30:00Z');
    const due = dueReminders(now, [
      { id: 'chi', timeZone: 'America/Chicago' },
      { id: 'den', timeZone: 'America/Denver' },
      { id: 'la', timeZone: 'America/Los_Angeles' },
    ]);
    expect(due).toEqual([{ deviceId: 'la', slot: 'lunch', date: '2026-10-22', timeZone: 'America/Los_Angeles' }]);
  });

  it('falls back to Central for devices with no or bad time zone', () => {
    const now = new Date('2026-10-22T16:10:00Z'); // 11:10am CDT
    expect(dueReminders(now, [{ id: 'a' }, { id: 'b', timeZone: 'Not/AZone' }]).map((d) => d.deviceId)).toEqual([
      'a',
      'b',
    ]);
    expect(deviceTimeZone({ timeZone: 'Not/AZone' })).toBe('America/Chicago');
  });

  it('uses the local date for the freezer reminder late at night', () => {
    // 03:20 UTC Oct 23 = 9:20pm Oct 22 in Denver (MDT).
    const [due] = dueReminders(new Date('2026-10-23T03:20:00Z'), [{ id: 'd', timeZone: 'America/Denver' }]);
    expect(due).toMatchObject({ slot: 'thaw', date: '2026-10-22' });
  });
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
