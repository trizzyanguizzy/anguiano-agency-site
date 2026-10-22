'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, SESSION_MAX_AGE, checkPasscode, sessionToken } from '@/lib/meals/auth';
import { getRedis, keys } from '@/lib/meals/redis';

const MAX_ATTEMPTS_PER_HOUR = 10;

export type LoginState = { error?: string };

function safeNext(next: FormDataEntryValue | null): string {
  const value = typeof next === 'string' ? next : '';
  // Only allow same-site paths inside /meals.
  return value.startsWith('/meals') && !value.startsWith('//') ? value : '/meals';
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const redis = getRedis();
  if (redis) {
    const h = await headers();
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const attempts = await redis.incr(keys.login(ip));
    if (attempts === 1) await redis.expire(keys.login(ip), 3600);
    if (attempts > MAX_ATTEMPTS_PER_HOUR) return { error: 'Too many attempts. Try again in an hour.' };
  }

  const passcode = formData.get('passcode');
  if (typeof passcode !== 'string' || !checkPasscode(passcode)) {
    return { error: 'That passcode didn’t work.' };
  }

  const token = await sessionToken();
  if (!token) return { error: 'Login isn’t configured yet (missing env vars).' };

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  redirect(safeNext(formData.get('next')));
}
