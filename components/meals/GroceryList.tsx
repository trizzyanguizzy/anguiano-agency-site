'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GroceryItem } from '@/lib/meals/schema';
import { cn } from '@/lib/utils';

type Section = { key: string; heading: string; items: GroceryItem[] };

export function GroceryList({
  weekId,
  sections,
  initialChecked,
  synced,
}: {
  weekId: string;
  sections: Section[];
  initialChecked: string[];
  synced: boolean;
}) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set(initialChecked));
  const [hideChecked, setHideChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!synced) return;
    try {
      const res = await fetch(`/api/meals/grocery?weekId=${encodeURIComponent(weekId)}`, { cache: 'no-store' });
      if (res.ok) setChecked(new Set((await res.json()).checked as string[]));
    } catch {
      /* offline; keep local state */
    }
  }, [synced, weekId]);

  // Converge with the other phone whenever this one comes back to the foreground.
  useEffect(() => {
    const onVisible = () => document.visibilityState === 'visible' && refresh();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
    };
  }, [refresh]);

  async function toggle(id: string) {
    const next = !checked.has(id);
    setChecked((prev) => {
      const s = new Set(prev);
      if (next) s.add(id);
      else s.delete(id);
      return s;
    });
    if (!synced) return;
    try {
      const res = await fetch('/api/meals/grocery', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ weekId, itemId: id, checked: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setError(null);
    } catch {
      setError('Couldn’t save that change. Check your connection.');
      refresh();
    }
  }

  const total = useMemo(() => sections.flatMap((s) => s.items).filter((i) => !i.have).length, [sections]);
  const done = useMemo(
    () => sections.flatMap((s) => s.items).filter((i) => !i.have && checked.has(i.id)).length,
    [sections, checked]
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-foreground-secondary">
          {done} of {total} in the cart
        </p>
        <button
          type="button"
          onClick={() => setHideChecked((v) => !v)}
          className="rounded-lg border border-border-default px-3 py-1.5 text-sm text-foreground-secondary"
        >
          {hideChecked ? 'Show all' : 'Hide checked'}
        </button>
      </div>
      {!synced && (
        <p className="mb-4 rounded-lg bg-background-tertiary p-3 text-sm text-foreground-secondary">
          Checkboxes are only saved on this device until storage is set up.
        </p>
      )}
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-6">
        {sections.map((section) => {
          const visible = section.items.filter((i) => !(hideChecked && (i.have || checked.has(i.id))));
          if (visible.length === 0) return null;
          return (
            <section key={section.key}>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground-tertiary">
                {section.heading}
              </h2>
              <ul className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-background-secondary">
                {visible.map((item) =>
                  item.have ? (
                    <li key={item.id} className="px-4 py-3 text-foreground-tertiary">
                      {item.name} <span className="text-sm">(have)</span>
                    </li>
                  ) : (
                    <li key={item.id}>
                      <label className="flex min-h-[3.25rem] cursor-pointer items-start gap-3 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={checked.has(item.id)}
                          onChange={() => toggle(item.id)}
                          className="mt-1 h-5 w-5 shrink-0 accent-[#10B981]"
                        />
                        <span className={cn('flex-1', checked.has(item.id) && 'text-foreground-tertiary line-through')}>
                          <span className="font-medium">{item.name}</span>
                          {item.qty && <span className="text-foreground-secondary">, {item.qty}</span>}
                          {item.note && <span className="block text-sm text-foreground-tertiary">{item.note}</span>}
                        </span>
                      </label>
                    </li>
                  )
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
