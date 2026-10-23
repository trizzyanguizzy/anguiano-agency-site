'use client';

import { useEffect, useState } from 'react';
import type { Ingredient } from '@/lib/meals/schema';
import { cn } from '@/lib/utils';

/** "2 tbsp" or "1½ lb" reads well before the name; "to taste" or "generous" reads better after it. */
function isMeasured(qty: string) {
  return /^[\d½¼¾⅓⅔⅛]/.test(qty.trim());
}

/** Tap-to-check ingredient list. Checks are remembered on this device for the day. */
export function IngredientList({ ingredients, storageKey }: { ingredients: Ingredient[]; storageKey: string }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(new Set(JSON.parse(raw) as number[]));
    } catch {
      /* storage unavailable */
    }
  }, [storageKey]);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  // Group consecutive ingredients that share a heading.
  const groups: Array<{ heading?: string; items: Array<Ingredient & { i: number }> }> = [];
  ingredients.forEach((ing, i) => {
    const last = groups[groups.length - 1];
    if (last && last.heading === ing.group) last.items.push({ ...ing, i });
    else groups.push({ heading: ing.group, items: [{ ...ing, i }] });
  });

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group, gi) => (
        <div key={`${group.heading ?? 'all'}-${gi}`}>
          {group.heading && (
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">
              {group.heading}
            </h3>
          )}
          <ul className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-background-secondary">
            {group.items.map((ing) => {
              const done = checked.has(ing.i);
              return (
                <li key={ing.i}>
                  <button
                    type="button"
                    onClick={() => toggle(ing.i)}
                    aria-pressed={done}
                    className="flex min-h-[3rem] w-full items-start gap-3 px-4 py-2.5 text-left"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                        done ? 'border-accent bg-accent text-background-primary' : 'border-border-emphasis'
                      )}
                    >
                      {done && <span className="text-[10px] font-bold leading-none">✓</span>}
                    </span>
                    <span className={cn('flex-1', done && 'text-foreground-tertiary line-through')}>
                      {ing.qty && isMeasured(ing.qty) ? (
                        <>
                          <span className="font-semibold">{ing.qty} </span>
                          <span>{ing.name}</span>
                        </>
                      ) : (
                        <>
                          <span>{ing.name}</span>
                          {ing.qty && <span className="text-foreground-tertiary">, {ing.qty}</span>}
                        </>
                      )}
                      {ing.note && <span className="block text-sm text-foreground-tertiary">{ing.note}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
