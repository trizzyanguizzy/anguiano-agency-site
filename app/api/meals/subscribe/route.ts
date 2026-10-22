import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getRedis } from '@/lib/meals/redis';
import {
  listSubscriptions,
  removeSubscription,
  renameSubscription,
  saveSubscription,
  subscriptionId,
} from '@/lib/meals/push';

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
});

function noStorage() {
  return NextResponse.json({ error: 'Storage isn’t set up yet. Add the Upstash integration in Vercel.' }, { status: 503 });
}

/** Lists registered devices (labels only). */
export async function GET() {
  if (!getRedis()) return noStorage();
  const subs = await listSubscriptions();
  return NextResponse.json({
    devices: subs.map((s) => ({ id: s.id, label: s.label, createdAt: s.createdAt })),
  });
}

export async function POST(request: Request) {
  if (!getRedis()) return noStorage();
  const parsed = PostBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'bad subscription' }, { status: 400 });
  const { subscription, label, replaces } = parsed.data;
  if (replaces) await removeSubscription(await subscriptionId(replaces));
  const id = await saveSubscription({ ...subscription, expirationTime: subscription.expirationTime ?? null }, label);
  return NextResponse.json({ id });
}

const PatchBody = z.object({ id: z.string().min(1), label: z.string().trim().min(1).max(60) });

/** Renames a device. */
export async function PATCH(request: Request) {
  if (!getRedis()) return noStorage();
  const parsed = PatchBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  const ok = await renameSubscription(parsed.data.id, parsed.data.label);
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
