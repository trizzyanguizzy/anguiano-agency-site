# Build plan: `/meals` household meal-plan PWA with push reminders

**Repo:** `trizzyanguizzy/anguiano-agency-site` · **Site:** tristananguiano.com (Vercel) · **Owner:** Tristan
**Goal:** a private `/meals` section of the existing site that shows today's lunch and dinner, the week, and a shared grocery checklist, installed on two iPhones as a home-screen web app that sends three push reminders a day. No App Store, no SMS.

Work in phases. **Phase 0 is investigation only — do not write code until it's done and its open questions are answered.** Stop and ask Tristan at every point marked 🛑.

---

## What's already known about the repo (verified 2026-10-22)

| Fact | Detail | Why it matters |
|---|---|---|
| Framework | **Next.js 16.1.6**, App Router, React 19, TypeScript | Next 16 renamed `middleware.ts` → **`proxy.ts`**. Confirm against the Next 16 docs before writing it. |
| Styling | **Tailwind 3.4** (`tailwind.config.ts`). The README says Next 15 / Tailwind v4 — the README is stale, trust `package.json`. | Reuse the existing tokens: `background.*`, `foreground.*`, `accent.orange` (actually green `#10B981`), `border.*`. |
| Root layout | `app/layout.tsx` wraps **every** route in `Header`, `Footer`, `CookieConsent`, HubSpot script, and `app/template.tsx` (framer-motion fade). | `/meals` must not render the portfolio chrome, cookie banner, or HubSpot. Needs a layout restructure (Phase 1). |
| Existing server code | Server actions only (`app/actions/sendEmail.ts` uses **Resend**, `verifyRecaptcha.ts`). No `app/api`, no middleware/proxy, no `vercel.json`, no database. | Resend is available as an email fallback. Storage must be added. |
| SEO files | `app/robots.ts` disallows only `/api/` and `/_next/`; `app/sitemap.ts` hard-codes the public routes. | Add `/meals` to robots disallow; keep it out of the sitemap; set `noindex` metadata. |
| Site config | `lib/constants.ts` → `SITE_CONFIG.url = https://tristananguiano.com`, `email = anguiano.dev@gmail.com` | Use that email as the VAPID `mailto:` subject. |
| Dependencies | `zod`, `resend`, `clsx`, `tailwind-merge` already installed. `react-email@3` pulls a nested `next@15.1.2` flagged for a CVE (dev tooling only, not shipped). | Use `zod` for the plan schema. Optionally bump `react-email` while you're in there; don't block on it. |
| Baseline build | `npm ci` works. `npm run build` failed in a sandbox only because it couldn't reach Google Fonts (`next/font/google`). | Re-run the baseline build in your environment; it should pass with network access. |
| Last commit | `06e7aef` on 2026-03-06 | Pull before starting. |

---

## Phase 0 — Investigate (no code changes)

1. `git pull`, `npm ci`, `npm run build`, `npm run lint`. Record any pre-existing failures so they aren't blamed on this work.
2. Confirm Vercel setup with `vercel` CLI or by asking Tristan:
   - Which Vercel project/team deploys this repo, and is it the Git integration (push to `main` → production)?
   - Production domain(s) — is it `tristananguiano.com`, `www.`, or both? Push subscriptions are origin-bound, so the app must live on **one canonical origin**.
   - **🛑 Plan tier: Hobby or Pro?** This decides the cron design (see Phase 4).
3. Read the Next 16 docs for: `proxy.ts` (the middleware rename), route groups with multiple layouts, `viewport`/`metadata` exports, `manifest` handling. Note any breaking change that affects this plan.
4. Check whether `app/not-found.tsx` depends on the root layout's Header/Footer (it will after Phase 1 moves them).
5. **🛑 Confirm with Tristan before Phase 1:**
   - Storage: OK to add **Upstash Redis** from the Vercel Marketplace (free tier)? He has to click through the integration in the Vercel dashboard; it injects the env vars.
   - Household passcode to gate the page (he picks it).
   - Reminder times (defaults below).

Deliverable: a short findings note back to Tristan (stack confirmations, plan tier, anything that contradicts this doc) before building.

---

## Architecture

```
content/meals/2026-10-22.json      ← one file per week, committed to git (source of truth)
        │  zod-validated by lib/meals/plan.ts
        ▼
/meals (PWA, passcode-gated)  ──subscribe──▶  /api/meals/subscribe  ──▶  Upstash Redis (subscriptions)
/meals/groceries  ◀──checkbox state──▶  /api/meals/grocery  ──▶  Upstash Redis (checked items)

Vercel Cron ──▶ /api/cron/meals/{lunch|dinner|thaw}  (CRON_SECRET)
                  ├─ is it the target hour in America/Chicago? else no-op
                  ├─ idempotency key in Redis (SET NX) — one send per slot per day
                  ├─ build message from today's / tomorrow's plan
                  └─ web-push to every stored subscription (drop 404/410s)
```

**Why the plan lives in git, not a DB:** Tristan plans each week in a Claude chat, Claude emits the JSON, it gets committed and deployed. Version history for free, no admin UI to build. Only mutable state (subscriptions, grocery checks, send-dedupe keys) goes in Redis.

### Reminder schedule (America/Chicago)

| Slot | Target local hour | Content | Source |
|---|---|---|---|
| `lunch` | 10:00–10:59 | "Lunch: {today.lunch.title}" + items | today |
| `dinner` | 15:00–15:59 | "Tonight: {today.dinner.title}" + sides + `startCookingNote` | today |
| `thaw` | 20:00–20:59 | "Move {items} from freezer to fridge for tomorrow's {tomorrow.dinner.title}" plus any `prepTonight` notes. **Skip silently if there's nothing to say.** If tomorrow has no plan at all, send "No meal plan for tomorrow — time to plan the week." | tomorrow (+ today's `prepTonight`) |

Lunch is at 11 and dinner between 5 and 6, so these fire early enough to act on.

---

## Phase 1 — Layout restructure (no behavior change for existing pages)

Keep a **single root layout** (avoids multiple-root-layout and `not-found` complications):

- `app/layout.tsx` → minimal: `<html>`, `<body>`, fonts, `globals.css`, JSON-LD, `<Analytics/>`, `<SpeedInsights/>`, and the site-wide `metadata`.
- New `app/(site)/layout.tsx` → `Header`, `<main>`, `Footer`, `CookieConsent`, HubSpot script.
- Move `page.tsx`, `about/`, `experience/`, `skills/`, `projects/`, `contact/`, and `template.tsx` into `app/(site)/`. URLs don't change (route groups don't affect paths).
- `app/not-found.tsx` now renders without chrome → render `Header`/`Footer` inside it, or move the chrome into a shared component it can use.
- **Acceptance:** every existing page looks identical before/after (compare locally), build and lint pass. Commit this phase on its own.

---

## Phase 2 — Data model, pages, and auth

### 2a. Week plan schema — `lib/meals/schema.ts` (zod)

```ts
const GroceryItem = z.object({
  id: z.string(),            // stable slug, e.g. "cod" — used as the checkbox key
  name: z.string(),
  qty: z.string().optional(),
  note: z.string().optional(),
  have: z.boolean().optional(), // true = already bought for an earlier meal, show as "(have)"
});

const Meal = z.object({
  title: z.string(),
  items: z.array(z.string()).default([]),       // components/sides shown on the card
  proteinG: z.string().optional(),               // "~50g"
  groceries: z.array(GroceryItem).default([]),
});

const Day = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // local America/Chicago date
  lunch: Meal.optional(),
  dinner: Meal.extend({
    fromFreezer: z.array(z.string()).default([]),  // drives the night-before thaw reminder
    startCookingNote: z.string().optional(),
    prepTonight: z.array(z.string()).default([]),  // e.g. "Slice half the chicken for Wednesday lunch"
  }).optional(),
});

export const WeekPlan = z.object({
  weekId: z.string(),                 // "2026-10-22"
  household: z.number().default(2),
  days: z.array(Day).min(1),
  extras: z.array(GroceryItem).default([]),  // snacks, candy, etc.
  notes: z.array(z.string()).default([]),
});
```

`lib/meals/plan.ts`:
- Import every `content/meals/*.json` statically (a small index file that imports each week is fine and keeps it bundler-friendly), validate with `WeekPlan.parse` at build time so a bad JSON file **fails the build**.
- `getDay(date)`, `getWeekContaining(date)`, `getToday()`, `getTomorrow()`.
- All date math in `America/Chicago` via `Intl.DateTimeFormat(..., { timeZone: 'America/Chicago' })`. Never use the server's local time (Vercel runs UTC). Write unit-testable helpers: `chicagoDate(now)`, `chicagoHour(now)`.

Add `content/meals/README.md` describing the schema so future weeks can be generated from it.

### 2b. Seed data
Create `content/meals/2026-10-22.json` from the **Appendix** at the bottom of this doc.

### 2c. Auth (simple household gate)
- `proxy.ts` (Next 16) matching `/meals/:path*` and `/api/meals/:path*`, **excluding** `/meals/login`. No valid cookie → redirect to `/meals/login` (pages) or 401 (API).
- `/meals/login`: single passcode field → server action compares to `MEALS_PASSCODE` with a constant-time compare → sets an **httpOnly, Secure, SameSite=Lax, 1-year** cookie containing an HMAC (`MEALS_SESSION_SECRET`) of a fixed value. Rate-limit attempts via Redis (e.g. 10/hour/IP).
- Cron routes are **not** behind this gate; they check `Authorization: Bearer ${CRON_SECRET}` (Vercel sends this automatically when `CRON_SECRET` is set).
- iOS gotcha: a home-screen web app has its **own cookie jar** separate from Safari. Each phone logs in once *inside the installed app*. Mention this on the install screen.

### 2d. Pages — own layout at `app/(meals)/meals/layout.tsx`
Mobile-first, dark theme from existing Tailwind tokens, large tap targets, no framer-motion page transitions. Exports:
- `metadata`: `robots: { index: false, follow: false }`, `manifest: '/meals-assets/manifest.webmanifest'`, `appleWebApp: { capable: true, title: 'Meals', statusBarStyle: 'black-translucent' }`, apple-touch-icon.
- `viewport`: `themeColor`, `viewportFit: 'cover'` (respect safe-area insets).

Routes:
- **`/meals`** — "Today" hero: lunch card, dinner card (with protein and `startCookingNote`), "Tonight" prep/thaw callout. Below: the rest of the week as compact rows. Footer links to Groceries and Settings. Server-rendered from the plan; `dynamic = 'force-dynamic'` or revalidate so "today" is correct.
- **`/meals/groceries`** — grouped by day → meal (the format Tristan asked for: each meal followed by its items), then Extras. Each item is a checkbox; checked state syncs via `/api/meals/grocery` (optimistic update, refetch on window focus so both phones converge). Toggle: "Show everything / Hide checked". Items with `have: true` render muted as "(have)" and aren't checkboxes.
- **`/meals/settings`** — notification setup (see Phase 3): install instructions, "Enable reminders" button, "Send test notification" button, list of registered devices with a remove button.
- **`/meals/login`** — passcode.

Also: add `'/meals'` to `disallow` in `app/robots.ts`. Don't add it to `sitemap.ts`. Don't add it to `NAVIGATION`.

---

## Phase 3 — PWA + Web Push

### Static assets (outside the auth gate)
- `public/meals-assets/manifest.webmanifest`:
  ```json
  {
    "name": "Meals", "short_name": "Meals",
    "id": "/meals", "start_url": "/meals", "scope": "/meals",
    "display": "standalone",
    "background_color": "#131314", "theme_color": "#131314",
    "icons": [
      { "src": "/meals-assets/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/meals-assets/icon-512.png", "sizes": "512x512", "type": "image/png" },
      { "src": "/meals-assets/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
    ]
  }
  ```
- Icons: generate simple ones (e.g. a fork/plate glyph on `#131314` with the green accent) at 192, 512, 512-maskable, and a 180×180 `apple-touch-icon.png`.
- **Service worker at `public/sw-meals.js`** (root path so it's allowed to register with `scope: '/meals'`; a SW under `/meals/` could only control `/meals/` with a trailing slash, which doesn't match Next's `/meals`).

### Service worker (`public/sw-meals.js`) — keep it minimal
- `install` → `skipWaiting()`; `activate` → `clients.claim()`.
- **No offline caching in v1** (avoids showing a stale "today").
- `push` → parse JSON `{ title, body, url, tag }` → `self.registration.showNotification(title, { body, tag, data: { url }, icon, badge })`. Always call `showNotification` inside `event.waitUntil` (iOS revokes push for silent pushes).
- `notificationclick` → focus an existing `/meals` client if open, else `clients.openWindow(url ?? '/meals')`.
- `pushsubscriptionchange` → re-subscribe and POST to `/api/meals/subscribe` (Safari may not fire it; harmless).

### Client registration (`/meals/settings`, client component)
1. Feature-detect `serviceWorker`, `PushManager`, `Notification`.
2. **iOS not installed** (`/iPhone|iPad/` and `!navigator.standalone` and `!matchMedia('(display-mode: standalone)').matches`): show step-by-step "Share → Add to Home Screen, then open Meals from your Home Screen and log in". Push only works inside the installed app on **iOS/iPadOS 16.4+**.
3. Register `navigator.serviceWorker.register('/sw-meals.js', { scope: '/meals' })`.
4. "Enable reminders" button → in the **click handler** (iOS requires a user gesture) call `Notification.requestPermission()`, then `registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(NEXT_PUBLIC_VAPID_PUBLIC_KEY) })`.
5. POST the subscription JSON plus a device label ("Tristan's iPhone") to `/api/meals/subscribe`.
6. Show current state: permission granted/denied, subscribed or not. If denied, explain how to re-enable in iOS Settings → Notifications → Meals.

### Server
- `npm i web-push @upstash/redis` and `-D @types/web-push`.
- `lib/meals/push.ts`: `webpush.setVapidDetails(VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)`; `sendToAll(payload)` → `Promise.allSettled`; on `statusCode` 404 or 410, delete that subscription. Set `TTL` (e.g. 3600 for lunch/dinner) and `urgency: 'high'`. Log counts (sent / removed / failed).
- Route handlers that use `web-push` need `export const runtime = 'nodejs'`.
- `POST /api/meals/subscribe` — zod-validate, store in Redis hash `meals:subs` keyed by sha256(endpoint). `DELETE` removes.
- `POST /api/meals/test` — sends "Test: reminders are working" to the caller's subscription only (pass endpoint in body).
- `GET/POST /api/meals/grocery` — Redis hash `meals:grocery:{weekId}` (`itemId → 1`), `HDEL` on uncheck.

### Redis keys
| Key | Type | Purpose |
|---|---|---|
| `meals:subs` | hash | sha256(endpoint) → `{ subscription, label, createdAt }` |
| `meals:grocery:{weekId}` | hash | checked grocery item ids |
| `meals:sent:{slot}:{yyyy-mm-dd}` | string, `SET NX EX 172800` | dedupe — cron delivery is best-effort and may double-fire |
| `meals:login:{ip}` | counter, `EX 3600` | login rate limit |

---

## Phase 4 — Cron

Create `vercel.json` (none exists today). Vercel Cron is **UTC-only**, and US Central switches from CDT (UTC−5) to CST (UTC−6) on **Sunday, Nov 1, 2026**. So register **two UTC schedules per slot** and let the handler no-op unless the Chicago hour matches. That keeps it correct across DST with zero maintenance.

### 🛑 If Hobby plan (each job may run at most once/day, fires anywhere within the scheduled hour)
```json
{
  "crons": [
    { "path": "/api/cron/meals/lunch",  "schedule": "0 15 * * *" },
    { "path": "/api/cron/meals/lunch",  "schedule": "0 16 * * *" },
    { "path": "/api/cron/meals/dinner", "schedule": "0 20 * * *" },
    { "path": "/api/cron/meals/dinner", "schedule": "0 21 * * *" },
    { "path": "/api/cron/meals/thaw",   "schedule": "0 1 * * *" },
    { "path": "/api/cron/meals/thaw",   "schedule": "0 2 * * *" }
  ]
}
```
Target Chicago hours: lunch **10**, dinner **15**, thaw **20**. Because Hobby only guarantees "within the hour", the handler checks the **hour**, not the minute. Verify Vercel accepts the same `path` twice; if not, use `/api/cron/meals/lunch-cdt` and `/lunch-cst` sharing one implementation.

### If Pro plan
Same double-schedule approach, but use exact minutes: lunch `30 15` / `30 16` (10:30), dinner `0 21` / `0 22` (4:00pm), thaw `0 1` / `0 2` (8:00pm), and have the handler check hour **and** minute window.

### Handler (`app/api/cron/meals/[slot]/route.ts` or three files)
```
GET:
  if Authorization !== `Bearer ${CRON_SECRET}` → 401
  now = new Date(); hour = chicagoHour(now); date = chicagoDate(now)
  if hour !== TARGET[slot] → 200 { skipped: 'wrong-hour' }
  if !(await redis.set(`meals:sent:${slot}:${date}`, '1', { nx: true, ex: 172800 })) → 200 { skipped: 'already-sent' }
  payload = buildMessage(slot, date)     // null → 200 { skipped: 'nothing-to-send' } and DEL the dedupe key
  result = await sendToAll(payload)
  return 200 { sent, removed, failed }
```
Also accept `?force=1&dryRun=1` (still CRON_SECRET-gated) to return the payload without sending — useful for testing.

### Message copy (keep bodies short; iOS truncates ~4 lines)
- Lunch: **"Lunch 🥪"** / "Tuna, sliced avocado, crackers, Greek yogurt cup"
- Dinner: **"Tonight: Filet mignon"** / "Garlic smashed potatoes, green beans · ~60g protein. Start the potatoes ~4:45."
- Thaw: **"Freezer → fridge tonight"** / "Ground beef (1.5 lb) for tomorrow's homemade chili."
- No plan: **"No meal plan for tomorrow"** / "Time to plan next week."

`buildMessage` must be a pure function with unit tests covering: normal day, no lunch, thaw with nothing in `fromFreezer` and no `prepTonight` (→ null), last day of the week with no next plan, and the Nov 1 DST boundary.

---

## Phase 5 — Deploy and verify

1. **🛑 Tristan, in the Vercel dashboard:** add the Upstash Redis integration to this project (Storage / Marketplace). Confirm which env var names it injects (`KV_REST_API_URL`/`KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`) and use `Redis.fromEnv()` or map explicitly.
2. Generate VAPID keys locally: `npx web-push generate-vapid-keys`. Never commit them.
3. Set env vars on Vercel for **Production and Preview**:

   | Var | Value |
   |---|---|
   | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | from step 2 |
   | `VAPID_PRIVATE_KEY` | from step 2 |
   | `VAPID_SUBJECT` | `mailto:anguiano.dev@gmail.com` |
   | `CRON_SECRET` | random 32+ chars |
   | `MEALS_PASSCODE` | 🛑 Tristan chooses |
   | `MEALS_SESSION_SECRET` | random 32+ chars |
   | Upstash vars | injected by the integration |

   Add all of them (with placeholder values) to `.env.example`, and document them in the README.
4. Open a PR from a feature branch → Vercel preview deploy. On the preview: log in, check every page on a phone-width viewport, toggle grocery items from two browsers and confirm they converge, call each cron route with `curl -H "Authorization: Bearer $CRON_SECRET" '<preview>/api/cron/meals/dinner?force=1&dryRun=1'`.
   - Note: crons **only run on production** deployments, and push subscriptions are tied to the origin, so a preview-origin subscription won't receive production pushes.
5. Merge to `main` → production. Then, on **each iPhone**: open tristananguiano.com/meals in Safari → Share → Add to Home Screen → open "Meals" from the Home Screen → log in → Settings → Enable reminders → Send test notification. Confirm it arrives with the phone locked.
6. Trigger each production cron route manually with `force=1` (not dry run) once to confirm real delivery. Then confirm the next scheduled lunch/dinner/thaw arrive on their own (check Vercel → Cron Jobs logs).
7. Report back to Tristan: production URL, what to do on his wife's phone, the env vars that were set, and how to add next week's plan.

### Weekly workflow to document in the README
1. Plan the week with Claude; ask for output matching `content/meals/README.md`.
2. Save as `content/meals/YYYY-MM-DD.json` (first day of the plan) and register it in the index.
3. Commit + push to `main` → deploys in ~1 min. A schema error fails the build, so a bad file never reaches production.

---

## Acceptance criteria

- [ ] Existing portfolio pages are visually and functionally unchanged; build and lint pass.
- [ ] `/meals*` is passcode-gated, `noindex`, excluded from robots and sitemap, and shows no portfolio header/footer, cookie banner, or HubSpot.
- [ ] `/meals` shows the correct "today" in America/Chicago regardless of server time zone.
- [ ] Grocery checkboxes persist and sync between two devices.
- [ ] Installable from iOS Safari to the Home Screen with a proper icon and standalone display.
- [ ] Test notification arrives on a locked iPhone.
- [ ] Lunch, dinner, and thaw reminders each arrive **once** per day in the right Chicago hour, including after the Nov 1 DST change.
- [ ] Expired subscriptions (404/410) are removed automatically.
- [ ] Unit tests cover the Chicago date/hour helpers and `buildMessage`.
- [ ] No secrets committed; `.env.example` and README updated.

## Out of scope for v1
Editing the plan from the app, offline caching, recipe pages, Android-specific polish, SMS, email fallback (Resend is already wired up if push turns out to be unreliable — add later as a per-device toggle).

---

## Appendix — seed data: `content/meals/2026-10-22.json`

```json
{
  "weekId": "2026-10-22",
  "household": 2,
  "notes": [
    "Shopping at Hy-Vee. Link the Perks account for member pricing.",
    "When you get home: freeze the ground beef, chicken thighs, and chicken breast."
  ],
  "days": [
    {
      "date": "2026-10-22",
      "lunch": {
        "title": "Tuna & avocado",
        "items": ["Can of tuna", "Sliced avocado", "Crackers", "High-protein Greek yogurt cup"],
        "proteinG": "~40–45g",
        "groceries": [
          { "id": "tuna", "name": "Tuna", "qty": "4 cans or pouches", "note": "Thu–Fri lunches" },
          { "id": "avocado-1", "name": "Avocados", "qty": "2" },
          { "id": "crackers", "name": "Crackers", "qty": "1 box" },
          { "id": "yogurt-cups", "name": "High-protein Greek yogurt cups", "qty": "4" }
        ]
      },
      "dinner": {
        "title": "Lemon garlic butter cod",
        "items": ["Roasted broccoli", "Jasmine rice"],
        "proteinG": "~50g",
        "startCookingNote": "Rice and broccoli first; cod cooks in ~15 min.",
        "fromFreezer": [],
        "prepTonight": [],
        "groceries": [
          { "id": "cod", "name": "Wild-caught cod", "qty": "1.25 lb", "note": "Fresh or frozen" },
          { "id": "broccoli-1", "name": "Broccoli", "qty": "1 crown" },
          { "id": "rice", "name": "Jasmine rice", "qty": "1 bag", "note": "Also Mon and Tue" },
          { "id": "lemons", "name": "Lemons", "qty": "3", "note": "1 is for Sunday" },
          { "id": "garlic", "name": "Garlic", "qty": "2 heads", "note": "Used all week" },
          { "id": "butter", "name": "Butter", "note": "Also Friday" }
        ]
      }
    },
    {
      "date": "2026-10-23",
      "lunch": {
        "title": "Tuna & avocado",
        "items": ["Can of tuna", "Sliced avocado", "Crackers", "High-protein Greek yogurt cup"],
        "proteinG": "~40–45g",
        "groceries": []
      },
      "dinner": {
        "title": "Filet mignon",
        "items": ["Garlic smashed potatoes", "Green beans"],
        "proteinG": "~60g",
        "startCookingNote": "Boil the potatoes first (~20 min); sear filets last.",
        "fromFreezer": [],
        "prepTonight": [],
        "groceries": [
          { "id": "filet", "name": "Filet mignon", "qty": "2 × ~8 oz", "note": "Ask the butcher for 1½\" thick" },
          { "id": "yukon", "name": "Yukon gold potatoes", "qty": "2 lb" },
          { "id": "green-beans", "name": "Green beans", "qty": "1 lb" },
          { "id": "garlic-have-fri", "name": "Garlic, butter", "have": true }
        ]
      }
    },
    {
      "date": "2026-10-24",
      "lunch": {
        "title": "Turkey & cheese sandwiches",
        "items": ["Deli turkey & cheese on whole-grain bread", "String cheese"],
        "proteinG": "~40–45g",
        "groceries": [
          { "id": "deli-turkey", "name": "Deli turkey", "qty": "1 lb", "note": "Sat–Sun lunches" },
          { "id": "sliced-cheese", "name": "Sliced cheese", "qty": "1 pack" },
          { "id": "bread", "name": "Whole-grain bread", "qty": "1 loaf" },
          { "id": "string-cheese", "name": "String cheese", "qty": "1 pack" }
        ]
      },
      "dinner": {
        "title": "Homemade beef chili",
        "items": ["Shredded cheddar", "Oyster crackers", "Cinnamon rolls on the side"],
        "proteinG": "~50g",
        "startCookingNote": "Brown the beef and onion, then simmer 30+ min. Bake cinnamon rolls while it simmers.",
        "fromFreezer": ["Ground beef (1.5 lb)"],
        "prepTonight": [],
        "groceries": [
          { "id": "ground-beef-chili", "name": "93% lean ground beef", "qty": "1.5 lb", "note": "Freeze when home" },
          { "id": "tomato-juice", "name": "Tomato juice", "qty": "46 oz" },
          { "id": "pinto", "name": "Pinto beans", "qty": "1 can" },
          { "id": "kidney", "name": "Kidney beans", "qty": "1 can" },
          { "id": "black-beans-1", "name": "Black beans", "qty": "1 can" },
          { "id": "jalapeno", "name": "Jalapeño", "qty": "1" },
          { "id": "chili-packet", "name": "Chili seasoning packet", "qty": "1" },
          { "id": "onion-1", "name": "Yellow onion", "qty": "1" },
          { "id": "cheddar", "name": "Shredded cheddar", "qty": "16 oz", "note": "Also Mon and Wed" },
          { "id": "oyster-crackers", "name": "Oyster crackers", "qty": "1 bag" },
          { "id": "cinnamon-rolls", "name": "Cinnamon rolls", "qty": "1 tube" }
        ]
      }
    },
    {
      "date": "2026-10-25",
      "lunch": {
        "title": "Turkey & cheese sandwiches",
        "items": ["Deli turkey & cheese on whole-grain bread", "String cheese"],
        "proteinG": "~40–45g",
        "groceries": []
      },
      "dinner": {
        "title": "Greek chicken thighs",
        "items": ["Tzatziki", "Cucumber-tomato-feta salad", "Pita"],
        "proteinG": "~55g",
        "startCookingNote": "Make tzatziki first so it chills; thighs roast ~25 min.",
        "fromFreezer": ["Chicken thighs (1.5 lb)"],
        "prepTonight": [],
        "groceries": [
          { "id": "chicken-thighs", "name": "Boneless chicken thighs", "qty": "1.5 lb", "note": "Freeze when home" },
          { "id": "greek-yogurt", "name": "Plain Greek yogurt", "qty": "32 oz", "note": "Also Monday" },
          { "id": "cucumbers", "name": "Cucumbers", "qty": "2" },
          { "id": "cherry-tomatoes", "name": "Cherry tomatoes", "qty": "1 pint" },
          { "id": "feta", "name": "Feta", "qty": "4 oz" },
          { "id": "pita", "name": "Pita", "qty": "1 pack" },
          { "id": "greek-seasoning", "name": "Greek seasoning", "note": "Check pantry" },
          { "id": "lemon-garlic-have-sun", "name": "Lemon, garlic", "have": true }
        ]
      }
    },
    {
      "date": "2026-10-26",
      "lunch": {
        "title": "Eggs & cottage cheese",
        "items": ["3 hard-boiled eggs", "Cottage cheese cup", "Sliced avocado", "Meat stick"],
        "proteinG": "~40g",
        "groceries": [
          { "id": "eggs", "name": "Pre-peeled hard-boiled eggs", "qty": "12", "note": "Mon–Tue lunches" },
          { "id": "cottage-cheese", "name": "Cottage cheese single cups", "qty": "4" },
          { "id": "avocado-2", "name": "Avocados", "qty": "2" },
          { "id": "meat-sticks", "name": "Meat sticks or jerky", "qty": "4" }
        ]
      },
      "dinner": {
        "title": "Chicken burrito bowls",
        "items": ["Rice", "Black beans", "Corn", "Salsa", "Cheddar", "Yogurt-lime sauce"],
        "proteinG": "~50g",
        "startCookingNote": "Cook all 2 lb of chicken breast tonight.",
        "fromFreezer": ["Chicken breast (2 lb)"],
        "prepTonight": ["Slice and fridge half the chicken for Wednesday's lunch wraps."],
        "groceries": [
          { "id": "chicken-breast", "name": "Boneless skinless chicken breast", "qty": "2 lb", "note": "Half is for Wednesday lunch. Freeze when home." },
          { "id": "black-beans-2", "name": "Black beans", "qty": "1 can" },
          { "id": "corn", "name": "Frozen corn", "qty": "1 bag" },
          { "id": "salsa", "name": "Salsa", "qty": "1 jar" },
          { "id": "limes", "name": "Limes", "qty": "2" },
          { "id": "cilantro", "name": "Cilantro", "qty": "1 bunch" },
          { "id": "onion-2", "name": "Yellow onion", "qty": "1" },
          { "id": "taco-seasoning", "name": "Taco seasoning", "note": "Check pantry" },
          { "id": "rice-cheddar-yogurt-have", "name": "Rice, cheddar, Greek yogurt", "have": true }
        ]
      }
    },
    {
      "date": "2026-10-27",
      "lunch": {
        "title": "Eggs & cottage cheese",
        "items": ["3 hard-boiled eggs", "Cottage cheese cup", "Sliced avocado", "Meat stick"],
        "proteinG": "~40g",
        "groceries": []
      },
      "dinner": {
        "title": "Shrimp stir-fry",
        "items": ["Snap peas", "Bell peppers", "Broccoli", "Over rice"],
        "proteinG": "~50g",
        "startCookingNote": "Thaw shrimp in cold water ~15 min if not moved to the fridge last night.",
        "fromFreezer": ["Shrimp (1 lb)"],
        "prepTonight": [],
        "groceries": [
          { "id": "shrimp", "name": "Frozen raw shrimp, peeled and deveined", "qty": "1 lb" },
          { "id": "snap-peas", "name": "Snap peas", "qty": "8 oz" },
          { "id": "bell-peppers", "name": "Bell peppers", "qty": "2" },
          { "id": "broccoli-2", "name": "Broccoli", "qty": "1 crown" },
          { "id": "green-onions", "name": "Green onions", "qty": "1 bunch" },
          { "id": "soy-sauce", "name": "Soy sauce", "note": "Check pantry" },
          { "id": "rice-garlic-have", "name": "Rice, garlic", "have": true }
        ]
      }
    },
    {
      "date": "2026-10-28",
      "lunch": {
        "title": "Chicken wraps",
        "items": ["Monday's sliced chicken in a tortilla", "Avocado", "Cheddar"],
        "proteinG": "~45g",
        "groceries": [
          { "id": "tortillas", "name": "Tortillas", "qty": "1 pack" },
          { "id": "avocado-3", "name": "Avocados", "qty": "2" },
          { "id": "chicken-cheddar-have", "name": "Cooked chicken from Monday, cheddar", "have": true }
        ]
      },
      "dinner": {
        "title": "Ground beef & sweet potato skillet",
        "items": ["Topped with cheddar", "Roasted Brussels sprouts"],
        "proteinG": "~60g",
        "startCookingNote": "Get the sweet potatoes and sprouts roasting first (~25 min).",
        "fromFreezer": ["Ground beef (1.25 lb)"],
        "prepTonight": [],
        "groceries": [
          { "id": "ground-beef-skillet", "name": "93% lean ground beef", "qty": "1.25 lb", "note": "Freeze when home" },
          { "id": "sweet-potatoes", "name": "Sweet potatoes", "qty": "3" },
          { "id": "brussels", "name": "Brussels sprouts", "qty": "1 lb" },
          { "id": "onion-3", "name": "Yellow onion", "qty": "1" },
          { "id": "cheddar-garlic-have", "name": "Cheddar, garlic", "have": true }
        ]
      }
    }
  ],
  "extras": [
    { "id": "chips", "name": "Chips and other savory snacks" },
    { "id": "halloween-candy", "name": "Halloween candy bags" }
  ]
}
```

**Avocado note for the UI:** buy at mixed ripeness so some are ready Thursday, Monday, and Wednesday.
