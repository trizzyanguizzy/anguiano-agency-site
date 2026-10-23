'use client';

import { useEffect } from 'react';
import { browserTimeZone, endpointId } from '@/lib/family/client';
import { SW_SCOPE } from './ServiceWorkerRegistrar';

const STORAGE_KEY = 'meals:lastSyncedTimeZone';

/**
 * Whenever the app is opened, tell the server which time zone this phone is in, so reminders
 * follow you when you travel. Only writes when the zone changed since the last sync.
 */
export function TimeZoneSync() {
  useEffect(() => {
    (async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
      const timeZone = browserTimeZone();
      if (!timeZone) return;
      const reg = await navigator.serviceWorker.getRegistration(SW_SCOPE);
      const sub = await reg?.pushManager.getSubscription();
      if (!sub) return;

      const id = await endpointId(sub.endpoint);
      const marker = `${id}:${timeZone}`;
      let last: string | null = null;
      try {
        last = localStorage.getItem(STORAGE_KEY);
      } catch {
        /* storage unavailable; just sync */
      }
      if (last === marker) return;

      const res = await fetch('/api/push/subscribe', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, timeZone }),
      });
      if (res.ok) {
        try {
          localStorage.setItem(STORAGE_KEY, marker);
        } catch {
          /* ignore */
        }
      }
    })().catch(() => {
      /* best effort; the next app open retries */
    });
  }, []);
  return null;
}
