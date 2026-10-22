'use client';

import { useEffect, useRef, useState } from 'react';

type WakeLockSentinelLike = { release: () => Promise<void>; addEventListener: (t: 'release', cb: () => void) => void };

/** Keeps the screen on while cooking (Screen Wake Lock API; iOS 16.4+ and most modern browsers). */
export function CookMode() {
  const [supported, setSupported] = useState(false);
  const [on, setOn] = useState(false);
  const lock = useRef<WakeLockSentinelLike | null>(null);

  useEffect(() => {
    setSupported('wakeLock' in navigator);
  }, []);

  async function acquire() {
    try {
      const wl = (navigator as Navigator & { wakeLock: { request: (t: 'screen') => Promise<WakeLockSentinelLike> } })
        .wakeLock;
      lock.current = await wl.request('screen');
      lock.current.addEventListener('release', () => {
        lock.current = null;
      });
      return true;
    } catch {
      return false;
    }
  }

  // The OS drops the lock when the app is backgrounded; take it back when you return.
  useEffect(() => {
    if (!on) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !lock.current) acquire();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [on]);

  useEffect(() => () => void lock.current?.release(), []);

  async function toggle() {
    if (on) {
      await lock.current?.release();
      lock.current = null;
      setOn(false);
    } else {
      setOn(await acquire());
    }
  }

  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className={
        on
          ? 'flex w-full items-center justify-between rounded-2xl border border-accent-orange/50 bg-accent-orange/10 px-4 py-3 text-left'
          : 'flex w-full items-center justify-between rounded-2xl border border-border-subtle bg-background-secondary px-4 py-3 text-left'
      }
    >
      <span>
        <span className="block font-medium">Cook mode</span>
        <span className="block text-sm text-foreground-tertiary">
          {on ? 'Screen will stay on' : 'Keep the screen on while you cook'}
        </span>
      </span>
      <span
        aria-hidden
        className={`relative h-7 w-12 rounded-full transition-colors ${on ? 'bg-accent-orange' : 'bg-background-tertiary'}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-foreground-primary transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </span>
    </button>
  );
}
