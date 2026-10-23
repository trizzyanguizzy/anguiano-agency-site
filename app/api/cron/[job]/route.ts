import { NextResponse } from 'next/server';
import { isCronAuthorized } from '@/lib/family/auth';
import { buildMessage, SLOTS, type Slot } from '@/lib/meals/messages';
import { getEffectiveWeeks } from '@/lib/meals/effective';
import { getDay } from '@/lib/meals/plan';
import { listSubscriptions, sendToAll } from '@/lib/family/push';
import { getRedis } from '@/lib/family/redis';
import { dueReminders, runTick } from '@/lib/meals/reminders';
import { addDays, chicagoDate } from '@/lib/family/time';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Jobs (all require `Authorization: Bearer $CRON_SECRET`):
 *
 *   /api/cron/tick-00 … tick-23
 *     The real schedule. vercel.json runs one of these each UTC hour (24 once-a-day jobs, which
 *     Hobby allows). Each run sends every device whatever is due in that device's own local time:
 *     lunch 11–11:59, dinner 5–5:59pm, freezer reminder 9–9:59pm. The suffix only exists so the
 *     24 cron paths are distinct. Add ?dryRun=1 to see what's due right now without sending.
 *
 *   /api/cron/lunch|dinner|thaw?force=1[&dryRun=1]
 *     Manual test: sends that reminder (for today in Central time) to every device right now.
 */
export async function GET(request: Request, { params }: { params: Promise<{ job: string }> }) {
  if (!isCronAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!getRedis()) return NextResponse.json({ error: 'storage not configured' }, { status: 503 });

  const { job } = await params;
  const url = new URL(request.url);
  const dryRun = url.searchParams.get('dryRun') === '1';

  if (/^tick(-\d{2})?$/.test(job)) {
    const now = new Date();
    if (dryRun) {
      const devices = await listSubscriptions();
      return NextResponse.json({
        now: now.toISOString(),
        devices: devices.map((d) => ({ label: d.label, timeZone: d.timeZone ?? '(Central default)' })),
        due: dueReminders(now, devices),
      });
    }
    const summary = await runTick(now);
    console.log('[meals tick]', JSON.stringify(summary));
    return NextResponse.json(summary);
  }

  if (SLOTS.includes(job as Slot)) {
    if (url.searchParams.get('force') !== '1') {
      return NextResponse.json({ error: 'manual sends need ?force=1' }, { status: 400 });
    }
    const date = chicagoDate();
    const plan = await getEffectiveWeeks();
    const payload = buildMessage(job as Slot, getDay(date, plan), getDay(addDays(date, 1), plan));
    if (dryRun || !payload) return NextResponse.json({ slot: job, date, payload });
    return NextResponse.json({ slot: job, date, ...(await sendToAll(payload)) });
  }

  return NextResponse.json({ error: 'unknown job' }, { status: 404 });
}
