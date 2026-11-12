# tristananguiano.com

The public site is a single **Under construction** page (`app/page.tsx`, `components/UnderConstruction.tsx`). Unknown paths show the same page, and the old portfolio paths (`/about`, `/experience`, `/skills`, `/projects`, `/contact`) redirect to it. The previous portfolio lives in git history.

Next.js 16, React 19, Tailwind 3, Node 24. Deployed on Vercel.

## /family: Anguiano family app

A private, installable family app at `/family`, behind a household passcode. **Meals** is the first section: the week's plan, recipes with cook mode, drag-and-drop rearranging, a grocery list that syncs between phones, and push reminders (lunch 11–noon, dinner 5–6, freezer 9–10pm in each phone's own time zone). Old `/meals` links redirect here.

| Path | What |
|---|---|
| `app/(family)/family/` | Pages: home, meals, settings, login |
| `components/family/`, `lib/family/` | Shared app pieces: tab bar, login, push, storage, time zones |
| `components/meals/`, `lib/meals/`, `content/meals/` | Meals section and weekly plans (see `content/meals/README.md`) |
| `app/api/{meals,push,cron}` | APIs; cron runs hourly via `vercel.json` |
| `proxy.ts` | Passcode gate for `/family` and its APIs |

**Adding a section:** create `app/(family)/family/<section>/`, add a tile on the home page and (if it deserves one) a tab in `components/family/AppNav.tsx`, and keep its Redis keys under a `<section>:` prefix.

- **Env vars:** see `.env.example`
- **Tests:** `npm test`
- **What reminders are due now:** `curl -H "Authorization: Bearer $CRON_SECRET" "https://tristananguiano.com/api/cron/tick?dryRun=1"`
- **Send one now (test):** `curl -H "Authorization: Bearer $CRON_SECRET" "https://tristananguiano.com/api/cron/dinner?force=1"`
