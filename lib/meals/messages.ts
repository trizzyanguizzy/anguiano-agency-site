import type { Day } from './schema';
import type { PushPayload } from './push';

export type Slot = 'lunch' | 'dinner' | 'thaw';

/**
 * Local hour each reminder fires in, in each device's own time zone: lunch 11:00–11:59,
 * dinner 5:00–5:59pm, freezer reminder 9:00–9:59pm. (Vercel Hobby cron fires somewhere
 * within the scheduled hour, hence a window rather than an exact minute.)
 */
export const TARGET_HOUR: Record<Slot, number> = { lunch: 11, dinner: 17, thaw: 21 };

export const SLOTS: readonly Slot[] = ['lunch', 'dinner', 'thaw'];

const join = (xs: string[]) => xs.filter(Boolean).join(', ');

/**
 * Pure: builds the notification for a slot, or null when there's nothing worth sending.
 * `today` and `tomorrow` are the plan days for the local Chicago date (undefined = no plan).
 */
export function buildMessage(slot: Slot, today: Day | undefined, tomorrow: Day | undefined): PushPayload | null {
  if (slot === 'lunch') {
    const lunch = today?.lunch;
    if (!lunch) return null;
    return {
      title: `Lunch: ${lunch.title}`,
      body: join(lunch.items) || lunch.title,
      tag: 'lunch',
      url: today ? `/meals/${today.date}/lunch` : '/meals',
    };
  }

  if (slot === 'dinner') {
    const dinner = today?.dinner;
    if (!dinner) return null;
    const details = [join(dinner.items), dinner.proteinG ? `${dinner.proteinG} protein` : '']
      .filter(Boolean)
      .join(' · ');
    const body = [details, dinner.startCookingNote].filter(Boolean).join('\n');
    return {
      title: `Tonight: ${dinner.title}`,
      body: body || dinner.title,
      tag: 'dinner',
      url: today ? `/meals/${today.date}/dinner` : '/meals',
    };
  }

  // thaw: tomorrow's freezer items + tonight's prep. Nag to plan if tomorrow is empty.
  if (!tomorrow) {
    return {
      title: 'No meal plan for tomorrow',
      body: 'Time to plan next week and add it to the site.',
      tag: 'thaw',
      url: '/meals',
    };
  }
  const freezer = tomorrow.dinner?.fromFreezer ?? [];
  const prep = today?.dinner?.prepTonight ?? [];
  if (freezer.length === 0 && prep.length === 0) return null;

  const lines: string[] = [];
  if (freezer.length > 0) {
    lines.push(`Move ${join(freezer)} to the fridge for tomorrow's ${tomorrow.dinner?.title ?? 'dinner'}.`);
  }
  lines.push(...prep);
  return {
    title: freezer.length > 0 ? 'Freezer → fridge tonight' : 'Prep for tomorrow',
    body: lines.join('\n'),
    tag: 'thaw',
    url: tomorrow.dinner ? `/meals/${tomorrow.date}/dinner` : '/meals',
  };
}
