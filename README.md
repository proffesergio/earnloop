# EarnLoop

**Learn it. Ship it. Loop the earnings.**

EarnLoop is a dark-mode, high-conversion web app for **AI-generated side hustle blueprints**, free AI tools (credit-gated), and logged-in premium services (design, merch, gift cards, sites, apps). Visitors feel like they are **doing real work that compounds**, not spinning a lottery wheel.

This repository is the source of truth for product, architecture, content contracts, and implementation order. Start here:

| File | Who it is for |
| --- | --- |
| [`AGENTS.md`](./AGENTS.md) | Any coding agent / vibe-coding tool |
| [`docs/00-PLAN.md`](./docs/00-PLAN.md) | A–Z product and UX plan |
| [`docs/01-ARCHITECTURE.md`](./docs/01-ARCHITECTURE.md) | Stack, folders, data, auth, ads |
| [`docs/02-CMS-AND-ADMIN.md`](./docs/02-CMS-AND-ADMIN.md) | Admin CMS surface area |
| [`docs/03-GROWTH-AND-CONVERSION.md`](./docs/03-GROWTH-AND-CONVERSION.md) | Research-backed conversion features |
| [`contracts/side-hustle.schema.json`](./contracts/side-hustle.schema.json) | JSON contract for hustle blueprints |
| [`contracts/database.sql`](./contracts/database.sql) | Minimal Supabase Postgres schema |
| [`.env.example`](./.env.example) | Required environment variables |

## Locked decisions

- **Brand:** EarnLoop
- **Stack:** Next.js App Router, React, Tailwind, TypeScript, shadcn/ui, Radix, Lucide, Framer Motion
- **Data/auth:** Supabase Auth (social) + Postgres (keep tables few and simple)
- **Hosting:** Vercel free tier
- **AI generation:** Platform Gemini + OpenAI (ChatGPT) with **free social-login credits**; no user-paid API keys required for the free tier
- **Ads:** Google **AdSense** on the website now; **AdMob** config stored in CMS for a future native app
- **v1 slice:** Public site + auth + gamification chrome + **full admin CMS** (content, ads, social, visitors, users, services catalog). Full checkout/payment providers can be stubbed behind typed order rows until Stripe is added.

## Local commands

```bash
npm install
npx shadcn@latest init
npm run dev
```

Do not invent a second stack. If a file in `docs/` and live code disagree, **update the docs in the same change**.

## Admin magic-link sign in

The `/admin` route is protected by Supabase Auth and the server-only `ADMIN_EMAILS` allowlist. Copy `.env.example` to `.env.local`, set the Supabase URL and anon key, and configure:

```bash
# Optional locally, but set the live URL on Vercel:
# NEXT_PUBLIC_SITE_URL=https://earnloop-kappa.vercel.app
ADMIN_EMAILS=owner@example.com,editor@example.com
```

In Supabase Auth → URL Configuration:
- **Site URL** must be the live app, e.g. `https://earnloop-kappa.vercel.app`. If it stays `http://localhost:3000`, Supabase silently sends the fallback `http://localhost:3000/?code=...` link instead of your callback, even when the code asks for the production URL.
- **Redirect URLs** must include both `http://localhost:3000/auth/callback` and `https://earnloop-kappa.vercel.app/auth/callback`.

Open `/admin`, enter an allowlisted email, then either click the emailed link or paste the six-digit code from the email into the login form. On Vercel the callback URL is resolved from `NEXT_PUBLIC_SITE_URL`, then `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL`; request headers are only used when no configured URL exists, so a stray local `NEXT_PUBLIC_SITE_URL` can no longer leak into production emails. The allowlist is checked server-side before a code is sent and again before the admin studio renders.

To show the six-digit code in the email as well as the link, open Supabase Auth → Email Templates → **Magic Link** and make sure the template includes `{{ .Token }}` alongside `{{ .ConfirmationURL }}`. The code verifies through `supabase.auth.verifyOtp`; without `{{ .Token }}` in the template the email contains only the link.

The editorial CMS requires the server-only `SUPABASE_SERVICE_ROLE_KEY` for guarded admin mutations. Keep it out of all `NEXT_PUBLIC_*` variables and never import the admin client into a Client Component.

## Scholarship MVP

The public `/scholarships` page is the first live product slice. It contains a curated, typed catalogue of government and programme sources, country study/visa portals, direct application guidance, and safety-focused social contact CTAs for a global audience.

The catalogue is intentionally not presented as an exhaustive scrape: deadlines, eligibility, funding, and immigration rules change. Work routes include document checklists and sequential application steps, including Australia subclasses 189, 190, 491, and 482. Each item links to its official source and the UI tells users to verify the live call before applying. To expand it, edit `lib/scholarships.ts`; only add sources where the URL is owned by the programme, government, embassy, or university.

Before production, replace the placeholder Facebook and WhatsApp URLs in `app/scholarships/page.tsx` with the project's owned pages. A natural next step is a scheduled server-side ingestion job that stores a source URL, fetched date, and editor approval before publishing changes.

### Admin account creation controls

The current `/admin` route is a UI preview only. For the first production CMS release, use a server-only `ADMIN_EMAILS` environment variable rather than building an invitation workflow:

```bash
ADMIN_EMAILS=owner@example.com,editor@example.com
```

Create or authenticate those users through Supabase Auth, then enforce exact normalized-email membership server-side on every admin page, server action, API route, and storage operation. Add or remove access by changing the Vercel variable and redeploying. Do not expose a public admin-registration form, use `NEXT_PUBLIC_ADMIN_EMAILS`, or expose the Supabase service-role key. Keep RLS as the final authorization layer and record allowlist changes once persistent audit events are wired. The full guard contract is in [`docs/02-CMS-AND-ADMIN.md`](./docs/02-CMS-AND-ADMIN.md).

## Deploy with Vercel CLI

1. Install and authenticate the CLI:

   ```bash
   npm install -g vercel
   vercel login
   ```

2. From the project root, create a preview deployment:

   ```bash
   vercel
   ```

   Accept the detected Next.js settings. Link to an existing Vercel project when prompted, or create a new one.

3. Add production configuration if needed. Copy `.env.example` to `.env.local` for local development; do not commit secrets. For this static MVP, no environment variable is required to render the scholarship directory. Set the public site URL when adding SEO or a database:

   ```bash
   vercel env add NEXT_PUBLIC_SITE_URL production
   ```

4. Build and deploy production:

   ```bash
   npm run build
   vercel --prod
   ```

5. Use the deployment URL to check `/` and `/scholarships`. Add a custom domain from the Vercel dashboard or with `vercel domains add example.com`.

For Git-based continuous deployment, run `vercel link` once and connect the repository in the Vercel dashboard; pushes to the production branch will then create deployments automatically.
