'use client';

import { useCallback, useEffect, useState } from 'react';
import { SW_SCOPE, SW_URL } from './ServiceWorkerRegistrar';

type Status =
  | 'checking'
  | 'unsupported'
  | 'ios-not-installed'
  | 'not-configured'
  | 'ready' // can subscribe
  | 'denied'
  | 'subscribed';

type Device = { id: string; label: string; createdAt: string };

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function isIos() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** Best guess at a readable name; browsers don't expose the phone's actual name. */
function defaultDeviceLabel() {
  const ua = navigator.userAgent;
  const device = /iPhone/.test(ua)
    ? 'iPhone'
    : /iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      ? 'iPad'
      : /Android/.test(ua)
        ? 'Android'
        : /Mac/.test(ua)
          ? 'Mac'
          : /Windows/.test(ua)
            ? 'Windows PC'
            : 'Device';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : '';
  return browser && !isStandalone() ? `${device} · ${browser}` : device;
}

/** Same id the server derives from the push endpoint (sha256, first 32 hex chars). */
async function endpointId(endpoint: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

function addedOn(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(iso));
}

async function getRegistration() {
  return (
    (await navigator.serviceWorker.getRegistration(SW_SCOPE)) ??
    (await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE }))
  );
}

export function ReminderSetup({ vapidPublicKey }: { vapidPublicKey: string }) {
  const [status, setStatus] = useState<Status>('checking');
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string; label: string } | null>(null);

  const loadDevices = useCallback(async (): Promise<Device[] | null> => {
    const res = await fetch('/api/meals/subscribe', { cache: 'no-store' }).catch(() => null);
    if (!res?.ok) return null;
    const list = (await res.json()).devices as Device[];
    setDevices(list);
    return list;
  }, []);

  useEffect(() => {
    (async () => {
      if (!vapidPublicKey) return setStatus('not-configured');
      const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      if (!supported) return setStatus(isIos() && !isStandalone() ? 'ios-not-installed' : 'unsupported');
      if (isIos() && !isStandalone()) return setStatus('ios-not-installed');
      if (Notification.permission === 'denied') return setStatus('denied');
      const [reg, list] = await Promise.all([getRegistration(), loadDevices()]);
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return setStatus('ready');
      const id = await endpointId(sub.endpoint);
      setMyId(id);
      // The browser can hold a subscription the server never saved (e.g. it was created before
      // storage was set up). Only call it "on" when the server knows this device; otherwise show
      // the name field so enabling re-registers the existing subscription.
      setStatus(list === null || list.some((d) => d.id === id) ? 'subscribed' : 'ready');
    })().catch(() => setStatus('unsupported'));
  }, [vapidPublicKey, loadDevices]);

  async function enable() {
    setBusy(true);
    setMessage(null);
    try {
      // Must run directly from the tap: iOS only shows the prompt for a user gesture.
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus(permission === 'denied' ? 'denied' : 'ready');
        return;
      }
      const reg = await getRegistration();
      await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        }));
      const res = await fetch('/api/meals/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), label: label.trim() || defaultDeviceLabel() }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`);
      setMyId(await endpointId(sub.endpoint));
      setStatus('subscribed');
      setMessage('Reminders are on for this device.');
      loadDevices();
    } catch (err) {
      setMessage(`Couldn’t turn on reminders: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    setBusy(true);
    setMessage(null);
    try {
      const sub = await (await getRegistration()).pushManager.getSubscription();
      if (!sub) throw new Error('This device isn’t subscribed.');
      const res = await fetch('/api/meals/test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setMessage(body.result === 'sent' ? 'Sent. It should arrive in a few seconds.' : `Result: ${body.result}`);
    } catch (err) {
      setMessage(`Test failed: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const sub = await (await getRegistration()).pushManager.getSubscription();
      if (sub) {
        await fetch('/api/meals/subscribe', {
          method: 'DELETE',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setMyId(null);
      setStatus('ready');
      setMessage('Reminders are off for this device.');
      loadDevices();
    } finally {
      setBusy(false);
    }
  }

  async function saveRename() {
    if (!editing) return;
    const next = editing.label.trim();
    if (!next) return setEditing(null);
    const res = await fetch('/api/meals/subscribe', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: editing.id, label: next }),
    });
    if (!res.ok) setMessage('Couldn’t rename that device.');
    setEditing(null);
    loadDevices();
  }

  async function removeDevice(id: string) {
    await fetch('/api/meals/subscribe', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadDevices();
  }

  const card = 'rounded-2xl border border-border-subtle bg-background-secondary p-4';
  const primary =
    'h-12 w-full rounded-xl bg-accent-orange text-lg font-semibold text-background-primary disabled:opacity-60';
  const secondary = 'h-11 w-full rounded-xl border border-border-default text-foreground-primary disabled:opacity-60';

  return (
    <div className="flex flex-col gap-4">
      {status === 'checking' && <p className="text-foreground-secondary">Checking this device…</p>}

      {status === 'ios-not-installed' && (
        <section className={card}>
          <h2 className="text-lg font-semibold">Add Meals to your Home Screen first</h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            iPhone only allows notifications from web apps installed on the Home Screen (iOS 16.4 or newer).
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-foreground-primary">
            <li>Tap the Share button in Safari.</li>
            <li>Choose “Add to Home Screen,” then “Add.”</li>
            <li>Open Meals from your Home Screen and log in again (it has its own login).</li>
            <li>Come back to Reminders and turn them on.</li>
          </ol>
        </section>
      )}

      {status === 'unsupported' && (
        <section className={card}>
          <p className="text-foreground-secondary">This browser doesn’t support push notifications.</p>
        </section>
      )}

      {status === 'not-configured' && (
        <section className={card}>
          <p className="text-foreground-secondary">
            Push isn’t configured on the server yet (missing VAPID keys).
          </p>
        </section>
      )}

      {status === 'denied' && (
        <section className={card}>
          <h2 className="text-lg font-semibold">Notifications are blocked</h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            Turn them back on in iPhone Settings → Notifications → Meals, then reopen the app.
          </p>
        </section>
      )}

      {status === 'ready' && (
        <section className={card}>
          <label htmlFor="device-label" className="text-sm font-medium text-foreground-secondary">
            Whose device is this?
          </label>
          <input
            id="device-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Tristan’s iPhone"
            maxLength={60}
            className="mt-1 h-11 w-full rounded-xl border border-border-default bg-background-primary px-3 text-foreground-primary outline-none focus:border-accent-orange"
          />
          <button type="button" onClick={enable} disabled={busy} className={`${primary} mt-3`}>
            {busy ? 'Turning on…' : 'Turn on reminders'}
          </button>
        </section>
      )}

      {status === 'subscribed' && (
        <section className={`${card} flex flex-col gap-3`}>
          <p className="font-medium">✅ Reminders are on for this device.</p>
          <button type="button" onClick={sendTest} disabled={busy} className={primary}>
            Send a test notification
          </button>
          <button type="button" onClick={disable} disabled={busy} className={secondary}>
            Turn off on this device
          </button>
        </section>
      )}

      {message && (
        <p role="status" className="text-sm text-foreground-secondary">
          {message}
        </p>
      )}

      {devices.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground-tertiary">
            Devices getting reminders
          </h2>
          <ul className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-background-secondary">
            {devices.map((d) => (
              <li key={d.id} className="px-4 py-3">
                {editing?.id === d.id ? (
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveRename();
                    }}
                  >
                    <label htmlFor={`rename-${d.id}`} className="sr-only">
                      Device name
                    </label>
                    <input
                      id={`rename-${d.id}`}
                      autoFocus
                      value={editing.label}
                      maxLength={60}
                      onChange={(e) => setEditing({ id: d.id, label: e.target.value })}
                      className="h-10 min-w-0 flex-1 rounded-lg border border-border-default bg-background-primary px-3 text-foreground-primary outline-none focus:border-accent-orange"
                    />
                    <button type="submit" className="rounded-lg bg-accent-orange px-3 text-sm font-semibold text-background-primary">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="rounded-lg px-2 text-sm text-foreground-tertiary"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {d.label}
                        {d.id === myId && (
                          <span className="ml-2 rounded-full bg-accent-orange/15 px-2 py-0.5 text-xs font-medium text-accent-orange-light">
                            This device
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-foreground-tertiary">Added {addedOn(d.createdAt)}</p>
                    </div>
                    <div className="flex shrink-0 gap-3 text-sm">
                      <button
                        type="button"
                        onClick={() => setEditing({ id: d.id, label: d.label })}
                        className="text-foreground-secondary hover:text-foreground-primary"
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDevice(d.id)}
                        className="text-foreground-tertiary hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
