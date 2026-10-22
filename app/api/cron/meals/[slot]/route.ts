import { NextResponse } from 'next/server';
import { isCronAuthorized } from '@/lib/meals/auth';
import { buildMessage, SLOTS, TARGET_HOUR, type Slot } from '@/lib/meals/messages';
import { getDay } from '@/lib/meals/plan';
import { sendToAll } from '@/lib/meals/push';
import { getRedis, keys } from '@/lib/meals/redis';
import { addDays, chicagoDate, chicagoHour } from '@/lib/meals/time';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Vercel Cron is UTC-only, so each slot is scheduled twice in vercel.json (`-cdt` and `-cst`
 * paths). Whichever run lands in the target Chicago hour sends; the other is a no-op.
 * A Redis SET NX key makes sure a slot sends at most once per day even if cron double-fires.
 *
 * Manual testing (still needs the cron secret):
 *   ?force=1           skip the hour check and dedupe
 *   ?force=1&dryRun=1  return the payload without sending
 */
export async function GET(request: Request, { params }: { params: Promise<{ slot: string }> }) {
  if (!isCronAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  // Paths look like /api/cron/meals/lunch-cdt; the suffix only exists so the two UTC schedules
  // have distinct cron paths.
  const rawSlot = (await params).slot.replace(/-(cdt|cst)$/, '');
  if (!SLOTS.includes(rawSlot as Slot)) return NextResponse.json({ error: 'unknown slot' }, { status: 404 });
  const slot = rawSlot as Slot;

  const url = new URL(request.url);
  const force = url.searchParams.get('force') === '1';
  const dryRun = url.searchParams.get('dryRun') === '1';

  const now = new Date();
  const date = chicagoDate(now);
  const hour = chicagoHour(now);
  if (!force && hour !== TARGET_HOUR[slot]) {
    return NextResponse.json({ skipped: 'wrong-hour', slot, chicagoHour: hour, target: TARGET_HOUR[slot] });
  }

  const payload = buildMessage(slot, getDay(date), getDay(addDays(date, 1)));
  if (dryRun) return NextResponse.json({ slot, date, payload });
  if (!payload) return NextResponse.json({ skipped: 'nothing-to-send', slot, date });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: 'storage not configured' }, { status: 503 });

  const dedupeKey = keys.sent(slot, date);
  if (!force) {
    const claimed = await redis.set(dedupeKey, now.toISOString(), { nx: true, ex: 60 * 60 * 48 });
    if (!claimed) return NextResponse.json({ skipped: 'already-sent', slot, date });
  }

  try {
    const result = await sendToAll(payload);
    console.log(`[meals cron] ${slot} ${date}`, result);
    return NextResponse.json({ slot, date, ...result });
  } catch (err) {
    // Release the claim so the next scheduled run (or a manual retry) can try again.
    if (!force) await redis.del(dedupeKey);
    console.error(`[meals cron] ${slot} ${date} failed`, err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
