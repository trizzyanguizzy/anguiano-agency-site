# Weekly meal plans

One JSON file per week, named for the plan's first day: `YYYY-MM-DD.json`. Register each new file in `index.ts`. Every file is validated against `lib/meals/schema.ts` at build time, so a typo fails the Vercel build instead of reaching production.

## Adding next week
1. Plan the week with Claude and ask for the output "as a meals JSON file matching content/meals/README.md".
2. Save it here as `YYYY-MM-DD.json` and add an import for it to `index.ts`.
3. Commit and push to `main`. The site picks it up on the next deploy (about a minute).

## Shape

```jsonc
{
  "weekId": "2026-10-22",           // same as the file name
  "household": 2,
  "notes": ["Shown at the bottom of the Week page"],
  "days": [
    {
      "date": "2026-10-22",          // America/Chicago calendar date
      "lunch": {
        "title": "Tuna & avocado",
        "items": ["Can of tuna", "Sliced avocado"],
        "proteinG": "~40g",
        "groceries": [
          { "id": "tuna", "name": "Tuna", "qty": "4 cans", "note": "Thu–Fri lunches" }
        ]
      },
      "dinner": {
        "title": "Filet mignon",
        "items": ["Garlic smashed potatoes", "Green beans"],
        "proteinG": "~60g",
        "startCookingNote": "Shown in the 3pm reminder",
        "fromFreezer": ["Ground beef (1.5 lb)"],   // triggers the 8pm reminder the NIGHT BEFORE
        "prepTonight": ["Slice half the chicken for Wednesday lunch"],  // 8pm reminder the same night
        "groceries": [
          { "id": "garlic-have", "name": "Garlic", "have": true }  // bought earlier in the week; no checkbox
        ]
      }
    }
  ],
  "extras": [{ "id": "chips", "name": "Chips" }]
}
```

Rules:
- Grocery `id`s must be unique across the whole week (they're the checkbox keys).
- List each grocery item under the **first** meal that uses it; later meals that reuse it get a `"have": true` line.
- A day can skip `lunch` or `dinner`.

## Reminders (each phone's local time)
| Window | What |
|---|---|
| 11:00–11:59 | Today's lunch |
| 5:00–5:59 pm | Tonight's dinner + `startCookingNote` |
| 9:00–9:59 pm | Tomorrow's `fromFreezer` + today's `prepTonight`. Skipped if both are empty. If tomorrow has no plan, it says to plan next week. |

Each phone reports its time zone whenever the app is opened, so the windows follow you when you travel (a phone in Denver gets lunch at 11 Mountain). Phones that haven't reported a zone use Central.

The windows are an hour wide because the site is on Vercel Hobby: `vercel.json` runs one once-a-day job per UTC hour (`tick-00`…`tick-23`), and Hobby fires each somewhere within its hour.
