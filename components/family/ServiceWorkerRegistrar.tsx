'use client';

import { useEffect } from 'react';

export const SW_URL = '/sw-family.js';
export const SW_SCOPE = '/family';

/** Registers the app's service worker on every page so it's active before push is enabled. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE }).catch((err) => {
      console.warn('Service worker registration failed', err);
    });
  }, []);
  return null;
}
