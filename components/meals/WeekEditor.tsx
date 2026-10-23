'use client';

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type Slot = 'lunch' | 'dinner';
export type Cell = {
  pos: string; // "2026-10-23:dinner"
  date: string;
  slot: Slot;
  title: string | null;
  proteinG?: string;
  origin: string; // position this meal was originally planned for
  locked: boolean; // past days can't be rearranged
};
export type Row = { date: string; weekday: string; dayLabel: string; isToday: boolean };

const slotOf = (pos: string) => pos.split(':')[1] as Slot;

function swapCells(cells: Record<string, Cell>, a: string, b: string): Record<string, Cell> {
  const next = { ...cells };
  const ca = cells[a];
  const cb = cells[b];
  next[a] = { ...ca, title: cb.title, proteinG: cb.proteinG, origin: cb.origin };
  next[b] = { ...cb, title: ca.title, proteinG: ca.proteinG, origin: ca.origin };
  return next;
}

export function WeekEditor({
  weekId,
  rows,
  initialCells,
  storageReady,
}: {
  weekId: string;
  rows: Row[];
  initialCells: Record<string, Cell>;
  storageReady: boolean;
}) {
  const router = useRouter();
  const [cells, setCells] = useState(initialCells);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [lastSwap, setLastSwap] = useState<[string, string] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setCells(initialCells), [initialCells]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // Press and hold to pick up, so normal scrolling still works on a phone.
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const canSwap = (a: string, b: string) =>
    a !== b && slotOf(a) === slotOf(b) && !cells[a]?.locked && !cells[b]?.locked;

  async function doSwap(a: string, b: string, { isUndo = false } = {}) {
    if (!canSwap(a, b)) return;
    const before = cells;
    setCells(swapCells(cells, a, b));
    setSelected(null);
    setMessage(null);
    if (!storageReady) {
      setCells(before);
      setMessage('Saving swaps needs storage set up (Upstash) first.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/meals/swaps', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ weekId, a, b }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`);
      setLastSwap(isUndo ? null : [a, b]);
      router.refresh();
    } catch (err) {
      setCells(before);
      setMessage(`Couldn’t save that swap: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/meals/swaps', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ weekId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLastSwap(null);
      router.refresh();
    } catch (err) {
      setMessage(`Couldn’t reset: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  function onTap(pos: string) {
    if (cells[pos].locked || busy) return;
    if (!selected) return setSelected(pos);
    if (selected === pos) return setSelected(null);
    if (slotOf(selected) !== slotOf(pos)) return setSelected(pos); // switch selection to the other type
    doSwap(selected, pos);
  }

  const onDragStart = (e: DragStartEvent) => {
    setSelected(null);
    setDragging(String(e.active.id));
  };
  const onDragEnd = (e: DragEndEvent) => {
    setDragging(null);
    if (e.over) doSwap(String(e.active.id), String(e.over.id));
  };

  const moved = Object.values(cells).some((c) => c.origin !== c.pos);
  const active = dragging ?? selected;

  return (
    <div>
      <p className="mb-4 text-sm text-foreground-secondary">
        Press and hold a meal, then drag it onto another day. Or tap two lunches (or two dinners) to swap them.
        Recipes, groceries, and reminders follow the meal.
      </p>

      <div className="mb-2 grid grid-cols-[3.25rem_1fr_1fr] gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">
        <span />
        <span>Lunch</span>
        <span>Dinner</span>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setDragging(null)}
      >
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div key={row.date} className="grid grid-cols-[3.25rem_1fr_1fr] items-stretch gap-2">
              <div className={cn('flex flex-col justify-center px-1', row.isToday && 'text-accent-light')}>
                <span className="text-sm font-semibold">{row.weekday}</span>
                <span className="text-xs text-foreground-tertiary">{row.dayLabel}</span>
              </div>
              {(['lunch', 'dinner'] as const).map((slot) => {
                const pos = `${row.date}:${slot}`;
                const cell = cells[pos];
                return (
                  <MealSlot
                    key={pos}
                    cell={cell}
                    selected={selected === pos}
                    validTarget={!!active && canSwap(active, pos)}
                    dimmed={!!active && active !== pos && !canSwap(active, pos)}
                    onTap={() => onTap(pos)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {dragging ? <Chip cell={cells[dragging]} lifted /> : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {lastSwap && (
          <button
            type="button"
            disabled={busy}
            onClick={() => doSwap(lastSwap[0], lastSwap[1], { isUndo: true })}
            className="h-11 rounded-xl border border-border-default px-4 text-foreground-primary disabled:opacity-50"
          >
            Undo last swap
          </button>
        )}
        {moved && (
          <button
            type="button"
            disabled={busy}
            onClick={reset}
            className="h-11 rounded-xl px-4 text-foreground-tertiary hover:text-foreground-primary disabled:opacity-50"
          >
            Reset to original plan
          </button>
        )}
      </div>
      {message && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {message}
        </p>
      )}
    </div>
  );
}

function MealSlot({
  cell,
  selected,
  validTarget,
  dimmed,
  onTap,
}: {
  cell: Cell;
  selected: boolean;
  validTarget: boolean;
  dimmed: boolean;
  onTap: () => void;
}) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: cell.pos, disabled: cell.locked });
  const { setNodeRef: setDragRef, attributes, listeners, isDragging } = useDraggable({
    id: cell.pos,
    disabled: cell.locked || !cell.title,
  });

  return (
    <div ref={setDropRef} className="min-w-0">
      <button
        ref={setDragRef}
        type="button"
        onClick={onTap}
        disabled={cell.locked}
        {...attributes}
        {...listeners}
        aria-pressed={selected}
        aria-label={`${cell.title ?? 'Nothing planned'}, ${cell.slot} on ${cell.date}`}
        className={cn(
          'h-full w-full touch-manipulation select-none rounded-xl text-left transition',
          '[-webkit-touch-callout:none]',
          isDragging && 'opacity-30',
          dimmed && 'opacity-40',
          cell.locked && 'cursor-not-allowed opacity-40'
        )}
      >
        <Chip cell={cell} selected={selected} highlight={validTarget && isOver} target={validTarget && !isOver} />
      </button>
    </div>
  );
}

function Chip({
  cell,
  selected,
  highlight,
  target,
  lifted,
}: {
  cell: Cell;
  selected?: boolean;
  highlight?: boolean;
  target?: boolean;
  lifted?: boolean;
}) {
  const movedHere = cell.origin !== cell.pos;
  return (
    <div
      className={cn(
        'flex h-full min-h-[4.25rem] flex-col justify-center rounded-xl border bg-background-secondary px-3 py-2',
        selected || highlight ? 'border-accent bg-accent/10' : 'border-border-subtle',
        target && 'border-dashed border-accent/60',
        lifted && 'scale-105 border-accent shadow-2xl shadow-black/60'
      )}
    >
      <span className={cn('line-clamp-2 text-sm font-medium leading-snug', !cell.title && 'text-foreground-tertiary')}>
        {cell.title ?? '—'}
      </span>
      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-foreground-tertiary">
        {cell.proteinG && <span>{cell.proteinG}</span>}
        {movedHere && <span className="text-accent-light">moved</span>}
      </span>
    </div>
  );
}
