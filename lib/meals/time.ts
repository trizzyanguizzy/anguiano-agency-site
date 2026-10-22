export const MEALS_TIME_ZONE = 'America/Chicago';

/** True for IANA zone names the runtime understands, e.g. "America/Denver". */
export function isValidTimeZone(tz: unknown): tz is string {
  if (typeof tz !== 'string' || tz.length === 0 || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function parts(now: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  });
  const out: Record<string, string> = {};
  for (const p of fmt.formatToParts(now)) out[p.type] = p.value;
  return out;
}

/** Local calendar date (YYYY-MM-DD) in the given zone. */
export function localDate(now: Date, timeZone: string): string {
  const p = parts(now, timeZone);
  return `${p.year}-${p.month}-${p.day}`;
}

/** Local hour (0–23) in the given zone. */
export function localHour(now: Date, timeZone: string): number {
  return Number(parts(now, timeZone).hour);
}

/** Local Chicago calendar date as YYYY-MM-DD. */
export function chicagoDate(now: Date = new Date()): string {
  return localDate(now, MEALS_TIME_ZONE);
}

/** Local Chicago hour, 0–23. */
export function chicagoHour(now: Date = new Date()): number {
  return localHour(now, MEALS_TIME_ZONE);
}

/** Adds whole days to a YYYY-MM-DD string (calendar math, no time zone involved). */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

/** "Thursday" for a YYYY-MM-DD string. */
export function weekdayName(date: string, style: 'long' | 'short' = 'long'): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { weekday: style, timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}

/** "Oct 22" for a YYYY-MM-DD string. */
export function shortDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}
