import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getRedis, keys } from '@/lib/meals/redis';
import { weeks } from '@/lib/meals/plan';

export const dynamic = 'force-dynamic';

const isKnownWeek = (weekId: string) => weeks.some((w) => w.weekId === weekId);

export async function GET(request: Request) {
  const weekId = new URL(request.url).searchParams.get('weekId') ?? '';
  if (!isKnownWeek(weekId)) return NextResponse.json({ error: 'unknown week' }, { status: 404 });
  const redis = getRedis();
  if (!redis) return NextResponse.json({ checked: [] });
  const all = (await redis.hgetall<Record<string, string>>(keys.grocery(weekId))) ?? {};
  return NextResponse.json({ checked: Object.keys(all) });
}

const Body = z.object({ weekId: z.string(), itemId: z.string().min(1).max(100), checked: z.boolean() });

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  const { weekId, itemId, checked } = parsed.data;
  if (!isKnownWeek(weekId)) return NextResponse.json({ error: 'unknown week' }, { status: 404 });

  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: 'storage not configured' }, { status: 503 });
  const key = keys.grocery(weekId);
  if (checked) {
    await redis.hset(key, { [itemId]: '1' });
    await redis.expire(key, 60 * 60 * 24 * 60); // keep 60 days
  } else {
    await redis.hdel(key, itemId);
  }
  return NextResponse.json({ ok: true });
}
