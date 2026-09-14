# Agent instructions — EarnLoop

You are implementing **EarnLoop**, not a generic AI blog. Read [`docs/00-PLAN.md`](./docs/00-PLAN.md) and [`docs/01-ARCHITECTURE.md`](./docs/01-ARCHITECTURE.md) before writing code.

## Product one-liner

A searchable hub of AI side-hustle blueprints plus credit-gated tools and (when logged in) premium fulfillment services. Gamification rewards **completed work** (checklists, proofs, loops closed), never idle clicks.

## Non-negotiables

1. Next.js App Router + TypeScript. **No `any`.** Prefer Zod-inferred types from `contracts/`.
2. Dark mode default, cyan/electric accent, Plus Jakarta Sans or Inter. Mobile-first.
3. Production-ready modules. No `// TODO: implement later` unless the user asked for a stub.
4. Skeletons + error boundaries on every data route.
5. SEO: semantic HTML, `generateMetadata`, Open Graph, sitemap, robots.
6. Supabase is the only backend. Stay inside **Vercel + Supabase free tier**: no Redis, no extra queues, no heavy background workers. Use Postgres, Storage, and Edge-friendly server actions / route handlers.
7. Ad slots are **AdSense** in the web app. Persist AdMob app IDs in `site_settings` for later; do not load AdMob SDK in the browser.
8. AI content is generated with **Gemini and OpenAI** using platform keys. Logged-in users spend **credits**. Guests see public hustles and teasers.
9. Keep components small: `app/`, `components/`, `hooks/`, `lib/`, `types/`, `contracts/`.
10. Before large diffs, outline which files change. After UI work, verify in the browser (or curl if no browser tools).

## Brand voice

Entrepreneurial, specific, honest about effort and capital. Ban “make $10k overnight” copy. Prefer “first $1 proof”, “hours to first listing”, “tools you already have”.

## Navbar (canonical)

`Learn` · `Earn` · `Tools` · `Services` · `News` · `Pricing` · (auth) `Loop` dashboard · `Admin` (role)

## When stuck

Re-read the JSON schema in `contracts/side-hustle.schema.json`. Every hustle page must render from that shape, including AI-generated payloads.
