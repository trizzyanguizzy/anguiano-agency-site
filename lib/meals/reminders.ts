import { buildMessage, SLOTS, TARGET_HOUR, type Slot } from './messages';
import { getEffectiveWeeks } from './effective';
import { getDay } from './plan';
import { listSubscriptions, sendToDevice, type DeviceRecord } from './push';
import { requireRedis, keys } from './redis';
import { addDays, isValidTimeZone, localDate, localHour, MEALS_TIME_ZONE } from './time';

export type Due = { deviceId: string; slot: Slot; date: string; timeZone: string };

/** The zone a device's reminders follow: whatever it last reported, else Central. */
export function deviceTimeZone(device: { timeZone?: string }): string {
  return isValidTimeZone(device.timeZone) ? device.timeZone : MEALS_TIME_ZONE;
}

/**
 * Pure: which reminders are due right now, per device, in each device's own local time.
 * The cron runs once an hour, so a slot is due when the device's local hour matches it.
 */
export function dueReminders(now: Date, devices: Array<{ id: string; timeZone?: string }>): Due[] {
  const due: Due[] = [];
  for (const device of devices) {
    const timeZone = deviceTimeZone(device);
    const hour = localHour(now, timeZone);
    for (const slot of SLOTS) {
      if (TARGET_HOUR[slot] === hour) {
        due.push({ deviceId: device.id, slot, date: localDate(now, timeZone), timeZone });
      }
    }
  }
  return due;
}

/** Hourly tick: sends each device whatever is due in its local time, at most once per slot per local day. */
export async function runTick(now = new Date()) {
  const [devices, plan] = await Promise.all([listSubscriptions(), getEffectiveWeeks()]);
  const byId = new Map<string, DeviceRecord>(devices.map((d) => [d.id, d]));
  const redis = requireRedis();
  const results: Array<Due & { result: string }> = [];

  for (const item of dueReminders(now, devices)) {
    const payload = buildMessage(item.slot, getDay(item.date, plan), getDay(addDays(item.date, 1), plan));
    if (!payload) {
      results.push({ ...item, result: 'nothing-to-send' });
      continue;
    }
    const key = keys.sent(item.slot, item.deviceId, item.date);
    const claimed = await redis.set(key, now.toISOString(), { nx: true, ex: 60 * 60 * 48 });
    if (!claimed) {
      results.push({ ...item, result: 'already-sent' });
      continue;
    }
    try {
      const result = await sendToDevice(byId.get(item.deviceId)!, payload);
      if (result === 'failed') await redis.del(key); // allow a manual retry
      results.push({ ...item, result });
    } catch (err) {
      await redis.del(key);
      results.push({ ...item, result: `error: ${(err as Error).message}` });
    }
  }
  return { devices: devices.length, results };
}
