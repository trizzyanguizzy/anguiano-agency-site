import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSwaps, saveSwaps } from '@/lib/meals/effective';
import { weeks } from '@/lib/meals/plan';
import { getRedis } from '@/lib/meals/redis';
import { swap, type Position } from '@/lib/meals/swaps';

export const dynamic = 'force-dynamic';

const findWeek = (weekId: string) => weeks.find((w) => w.weekId === weekId);
const Pos = z.string().regex(/^\d{4}-\d{2}-\d{2}:(lunch|dinner)$/) as unknown as z.ZodType<Position>;

function noStorage() {
  return NextResponse.json({ error: 'Storage isn’t set up yet.' }, { status: 503 });
}

export async function GET(request: Request) {
  const weekId = new URL(request.url).searchParams.get('weekId') ?? '';
  if (!findWeek(weekId)) return NextResponse.json({ error: 'unknown week' }, { status: 404 });
  return NextResponse.json({ swaps: await getSwaps(weekId) });
}

const PostBody = z.object({ weekId: z.string(), a: Pos, b: Pos });

/** Swaps the meals currently shown at positions a and b. */
export async function POST(request: Request) {
  if (!getRedis()) return noStorage();
  const parsed = PostBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  const { weekId, a, b } = parsed.data;
  const week = findWeek(weekId);
  if (!week) return NextResponse.json({ error: 'unknown week' }, { status: 404 });
  try {
    const next = swap(await getSwaps(weekId), a, b, week);
    await saveSwaps(weekId, next);
    return NextResponse.json({ swaps: next });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

const DeleteBody = z.object({ weekId: z.string() });

/** Resets the week to the plan as written. */
export async function DELETE(request: Request) {
  if (!getRedis()) return noStorage();
  const parsed = DeleteBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !findWeek(parsed.data.weekId)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
  await saveSwaps(parsed.data.weekId, {});
  return NextResponse.json({ swaps: {} });
}
