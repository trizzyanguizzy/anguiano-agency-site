// Household passcode gate. Uses Web Crypto so it runs in both proxy.ts and Node route handlers.

export const SESSION_COOKIE = 'meals_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const encoder = new TextEncoder();

function toBase64Url(buf: ArrayBuffer): string {
  let s = '';
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Constant-time string compare. */
export function safeEqual(a: string, b: string): boolean {
  const ab = encoder.encode(a);
  const bb = encoder.encode(b);
  let diff = ab.length ^ bb.length;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

/**
 * The session token is an HMAC of the passcode itself, so changing MEALS_PASSCODE
 * signs everyone out, and rotating MEALS_SESSION_SECRET does too.
 */
export async function sessionToken(): Promise<string | null> {
  const secret = process.env.MEALS_SESSION_SECRET;
  const passcode = process.env.MEALS_PASSCODE;
  if (!secret || !passcode) return null;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`meals-household-v1:${passcode}`));
  return toBase64Url(sig);
}

export async function isValidSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await sessionToken();
  return expected !== null && safeEqual(cookieValue, expected);
}

export function checkPasscode(input: string): boolean {
  const passcode = process.env.MEALS_PASSCODE;
  return !!passcode && safeEqual(input.trim(), passcode);
}

/** Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. */
export function isCronAuthorized(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  return !!secret && !!authHeader && safeEqual(authHeader, `Bearer ${secret}`);
}
