# Tristan Anguiano - Portfolio Website

A modern, performant portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- ⚡️ **Next.js 15** with App Router and React Server Components
- 🎨 **Tailwind CSS v4** for styling with custom design system
- 📱 **Fully Responsive** - Mobile-first design
- ♿️ **Accessible** - WCAG AA compliant
- 🚀 **Optimized Performance** - Core Web Vitals optimized
- 📧 **Contact Form** - With reCAPTCHA v3 and email integration
- 📊 **Analytics** - HubSpot and Vercel Analytics integration
- 🌙 **Dark Mode** - Automatic based on system preference
- ✨ **Smooth Animations** - Using Framer Motion

## Tech Stack

**Frontend:**
- Next.js 15
- TypeScript 5.x
- Tailwind CSS v4
- Framer Motion
- React Hook Form + Zod

**Backend:**
- Next.js Server Actions
- Resend (Email)
- React Email (Email templates)

**Services:**
- Vercel (Hosting)
- HubSpot (Analytics)
- Google reCAPTCHA v3

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tristananguiano/tristandotcom.git
cd tristandotcom
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in your environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Resend API Key (for email)
RESEND_API_KEY=your_resend_api_key

# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# HubSpot Portal ID (for analytics)
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=your_hubspot_portal_id

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── actions/           # Server Actions
│   ├── (pages)/           # Page routes
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── sitemap.ts         # Sitemap generation
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── contact/          # Contact form
│   ├── experience/       # Experience timeline
│   └── projects/         # Projects grid
├── content/              # Content data
│   ├── experience.ts     # Work experience
│   └── projects.ts       # Projects
├── lib/                  # Utilities
│   ├── constants.ts      # Site constants
│   ├── schemas.ts        # Zod schemas
│   ├── utils.ts          # Utility functions
│   └── email-templates.tsx # Email templates
└── public/               # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size

## Deployment

The site is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## License

© 2026 Tristan Anguiano. All rights reserved.

## Contact

- Email: anguiano.dev@gmail.com
- LinkedIn: [linkedin.com/in/tristananguiano](https://linkedin.com/in/tristan-anguiano)

## /meals — household meal planner

A private, installable web app at `/meals`: today's lunch and dinner, the week, a grocery checklist that syncs between phones, and push reminders (lunch 11–11:59, dinner 5–5:59pm, freezer-to-fridge 9–9:59pm in each phone's local time zone).

- **Weekly plans:** `content/meals/` (see the README there for the format and how to add a week)
- **Code:** `app/(meals)/meals`, `app/api/meals`, `app/api/cron/meals`, `lib/meals`, `proxy.ts`, `public/sw-meals.js`
- **Env vars:** see the `/meals` section of `.env.example`
- **Storage:** Upstash Redis via the Vercel Marketplace (push subscriptions, grocery checks, send dedupe)
- **Tests:** `npm test`
- **See what is due right now:** `curl -H "Authorization: Bearer $CRON_SECRET" "https://tristananguiano.com/api/cron/meals/tick?dryRun=1"`
- **Send a reminder now (test):** `curl -H "Authorization: Bearer $CRON_SECRET" "https://tristananguiano.com/api/cron/meals/dinner?force=1"`
