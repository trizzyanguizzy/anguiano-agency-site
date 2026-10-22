import { Redis } from '@upstash/redis';

let client: Redis | null | undefined;

/**
 * Upstash via the Vercel Marketplace injects either KV_REST_API_* or UPSTASH_REDIS_REST_*
 * depending on how the integration was added. Accept both.
 */
export function getRedis(): Redis | null {
  if (client !== undefined) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  return client;
}

export function requireRedis(): Redis {
  const r = getRedis();
  if (!r) throw new Error('Redis is not configured. Add the Upstash integration in Vercel.');
  return r;
}

export const keys = {
  subs: 'meals:subs',
  grocery: (weekId: string) => `meals:grocery:${weekId}`,
  sent: (slot: string, deviceId: string, date: string) => `meals:sent:${slot}:${deviceId}:${date}`,
  login: (ip: string) => `meals:login:${ip}`,
};
