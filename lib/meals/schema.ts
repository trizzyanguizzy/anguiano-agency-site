import { z } from 'zod';

export const GroceryItem = z.object({
  /** Stable slug, unique within a week. Used as the checkbox key. */
  id: z.string().min(1),
  name: z.string().min(1),
  qty: z.string().optional(),
  note: z.string().optional(),
  /** Already bought for an earlier meal this week; shown as "(have)" with no checkbox. */
  have: z.boolean().optional(),
});

export const Meal = z.object({
  title: z.string().min(1),
  items: z.array(z.string()).default([]),
  proteinG: z.string().optional(),
  groceries: z.array(GroceryItem).default([]),
});

export const Dinner = Meal.extend({
  /** Items to move from freezer to fridge the night before. Drives the thaw reminder. */
  fromFreezer: z.array(z.string()).default([]),
  startCookingNote: z.string().optional(),
  /** Prep to do after tonight's dinner, e.g. "Slice half the chicken for Wednesday lunch". */
  prepTonight: z.array(z.string()).default([]),
});

export const Day = z.object({
  /** Local America/Chicago date, YYYY-MM-DD. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lunch: Meal.optional(),
  dinner: Dinner.optional(),
});

export const WeekPlan = z
  .object({
    weekId: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    household: z.number().int().positive().default(2),
    notes: z.array(z.string()).default([]),
    days: z.array(Day).min(1),
    extras: z.array(GroceryItem).default([]),
  })
  .superRefine((week, ctx) => {
    const ids = new Set<string>();
    const check = (id: string) => {
      if (ids.has(id)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate grocery id "${id}"` });
      ids.add(id);
    };
    for (const day of week.days) {
      day.lunch?.groceries.forEach((g) => check(g.id));
      day.dinner?.groceries.forEach((g) => check(g.id));
    }
    week.extras.forEach((g) => check(g.id));
  });

export type GroceryItem = z.infer<typeof GroceryItem>;
export type Meal = z.infer<typeof Meal>;
export type Dinner = z.infer<typeof Dinner>;
export type Day = z.infer<typeof Day>;
export type WeekPlan = z.infer<typeof WeekPlan>;
