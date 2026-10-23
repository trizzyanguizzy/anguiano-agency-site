/* Service worker for the Anguiano family app. Push only; no offline caching (avoids a stale "today"). */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'Anguiano';
  // iOS revokes push permission if a push doesn't show a notification, so always show one.
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || '',
      tag: data.tag || 'meals',
      data: { url: data.url || '/family' },
      icon: '/family-assets/icon-192.png',
      badge: '/family-assets/icon-192.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/family';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (new URL(client.url).pathname.startsWith('/family') && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// Not fired by Safari, but keeps Chrome/Android subscriptions alive if the browser rotates them.
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    (async () => {
      const old = event.oldSubscription;
      const options = old && old.options ? old.options : null;
      if (!options) return;
      const sub = await self.registration.pushManager.subscribe(options);
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subscription: sub.toJSON(), label: 'Renewed device', replaces: old.endpoint }),
      });
    })()
  );
});
