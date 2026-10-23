import { cache } from 'react';
import { getRedis, keys } from '../family/redis';
import { weeks } from './plan';
import type { WeekPlan } from './schema';
import { applySwaps, normalize, type SwapMap } from './swaps';

/** The saved swaps for a week (empty when none, or when storage isn't configured). */
export async function getSwaps(weekId: string): Promise<SwapMap> {
  const redis = getRedis();
  const week = weeks.find((w) => w.weekId === weekId);
  if (!redis || !week) return {};
  const stored = await redis.get<SwapMap>(keys.swaps(weekId));
  return stored ? normalize(stored, week) : {};
}

export async function saveSwaps(weekId: string, map: SwapMap) {
  const redis = getRedis();
  if (!redis) throw new Error('Storage isn’t set up yet.');
  if (Object.keys(map).length === 0) await redis.del(keys.swaps(weekId));
  else await redis.set(keys.swaps(weekId), map, { ex: 60 * 60 * 24 * 60 }); // keep 60 days
}

/**
 * Every week with its swaps applied: what the app, recipes, groceries, and reminders should use.
 * Cached per request in server components.
 */
export const getEffectiveWeeks = cache(async (): Promise<WeekPlan[]> => {
  if (!getRedis()) return weeks;
  return Promise.all(weeks.map(async (w) => applySwaps(w, await getSwaps(w.weekId))));
});
