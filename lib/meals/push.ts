import webpush, { type PushSubscription } from 'web-push';
import { requireRedis, keys } from './redis';

export type PushPayload = { title: string; body: string; url?: string; tag?: string };

export type StoredSubscription = {
  subscription: PushSubscription;
  label: string;
  createdAt: string;
};

let configured = false;
function configure() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? 'mailto:anguiano.dev@gmail.com';
  if (!publicKey || !privateKey) throw new Error('VAPID keys are not configured.');
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export async function subscriptionId(endpoint: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint));
  return Buffer.from(digest).toString('hex').slice(0, 32);
}

export async function listSubscriptions(): Promise<Array<StoredSubscription & { id: string }>> {
  const all = (await requireRedis().hgetall<Record<string, StoredSubscription>>(keys.subs)) ?? {};
  return Object.entries(all).map(([id, value]) => ({ id, ...value }));
}

export async function saveSubscription(subscription: PushSubscription, label: string) {
  const id = await subscriptionId(subscription.endpoint);
  const value: StoredSubscription = { subscription, label, createdAt: new Date().toISOString() };
  await requireRedis().hset(keys.subs, { [id]: value });
  return id;
}

export async function renameSubscription(id: string, label: string): Promise<boolean> {
  const redis = requireRedis();
  const current = await redis.hget<StoredSubscription>(keys.subs, id);
  if (!current) return false;
  await redis.hset(keys.subs, { [id]: { ...current, label } });
  return true;
}

export async function removeSubscription(id: string) {
  await requireRedis().hdel(keys.subs, id);
}

async function sendOne(sub: StoredSubscription & { id: string }, payload: PushPayload) {
  try {
    await webpush.sendNotification(sub.subscription, JSON.stringify(payload), { TTL: 60 * 60, urgency: 'high' });
    return 'sent' as const;
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) {
      await removeSubscription(sub.id);
      return 'removed' as const;
    }
    console.error(`Push to "${sub.label}" failed`, status, (err as Error).message);
    return 'failed' as const;
  }
}

/** Sends to every stored device; drops subscriptions the push service says are gone. */
export async function sendToAll(payload: PushPayload) {
  configure();
  const subs = await listSubscriptions();
  const results = await Promise.all(subs.map((s) => sendOne(s, payload)));
  const count = (k: string) => results.filter((r) => r === k).length;
  return { devices: subs.length, sent: count('sent'), removed: count('removed'), failed: count('failed') };
}

export async function sendToEndpoint(endpoint: string, payload: PushPayload) {
  configure();
  const id = await subscriptionId(endpoint);
  const sub = (await listSubscriptions()).find((s) => s.id === id);
  if (!sub) return 'not-found' as const;
  return sendOne(sub, payload);
}
