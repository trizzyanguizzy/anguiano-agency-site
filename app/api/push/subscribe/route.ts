import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getRedis } from '@/lib/family/redis';
import {
  listSubscriptions,
  removeSubscription,
  saveSubscription,
  subscriptionId,
  updateSubscription,
} from '@/lib/family/push';
import { isValidTimeZone } from '@/lib/family/time';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Subscription = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({ p256dh: z.string(), auth: z.string() }),
});

const PostBody = z.object({
  subscription: Subscription,
  label: z.string().trim().min(1).max(60).default('Phone'),
  replaces: z.string().url().optional(),
  timeZone: z.string().refine(isValidTimeZone, 'unknown time zone').optional(),
});

function noStorage() {
  return NextResponse.json({ error: 'Storage isn’t set up yet. Add the Upstash integration in Vercel.' }, { status: 503 });
}

/** Lists registered devices (labels only). */
export async function GET() {
  if (!getRedis()) return noStorage();
  const subs = await listSubscriptions();
  return NextResponse.json({
    devices: subs.map((s) => ({ id: s.id, label: s.label, createdAt: s.createdAt, timeZone: s.timeZone ?? null })),
  });
}

export async function POST(request: Request) {
  if (!getRedis()) return noStorage();
  const parsed = PostBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'bad subscription' }, { status: 400 });
  const { subscription, label, replaces, timeZone } = parsed.data;
  if (replaces) await removeSubscription(await subscriptionId(replaces));
  const id = await saveSubscription(
    { ...subscription, expirationTime: subscription.expirationTime ?? null },
    label,
    timeZone
  );
  return NextResponse.json({ id });
}

const PatchBody = z
  .object({
    id: z.string().min(1),
    label: z.string().trim().min(1).max(60).optional(),
    timeZone: z.string().refine(isValidTimeZone, 'unknown time zone').optional(),
  })
  .refine((b) => b.label !== undefined || b.timeZone !== undefined, 'nothing to update');

/** Renames a device and/or records the time zone it's in now. */
export async function PATCH(request: Request) {
  if (!getRedis()) return noStorage();
  const parsed = PatchBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  const { id, label, timeZone } = parsed.data;
  const ok = await updateSubscription(id, { label, timeZone });
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'not found' }, { status: 404 });
}

const DeleteBody = z.union([z.object({ endpoint: z.string().url() }), z.object({ id: z.string().min(1) })]);

export async function DELETE(request: Request) {
  if (!getRedis()) return noStorage();
  const parsed = DeleteBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  const id = 'id' in parsed.data ? parsed.data.id : await subscriptionId(parsed.data.endpoint);
  await removeSubscription(id);
  return NextResponse.json({ ok: true });
}
