# EarnLoop architecture

## Stack (locked)

| Layer | Choice | Why |
| --- | --- | --- |
| App | Next.js App Router (latest stable) | Vercel, RSC, metadata |
| UI | Tailwind + shadcn/ui + Radix + Lucide | Fast, accessible |
| Motion | Framer Motion | Checklist / rank-up only |
| Validation | Zod | JSON + forms + AI payloads |
| Data | Server Components for reads; client admin UI fetches `fetch()` in effects | No heavy client state lib in v1 |
| Auth/DB | Supabase (Google social + Postgres) | Free tier, RLS, simple |
| Host | Vercel Hobby | Requested |
| AI | `@google/generative-ai` + `openai` | Free-credit tools |
| Ads | AdSense JS slots | Web; AdMob IDs stored only |
| Analytics | First-party `page_views` table + optional Vercel Analytics | No paid analytics required |

**Not in v1:** Redis, Prisma (use Supabase client), Kafka, separate Nest API, AdMob SDK, native apps.

## Directory layout (create as you implement)

```
app/
  (marketing)/          # landing, learn, earn, tools, services, news, pricing
  (auth)/login/
  app/                  # member Loop dashboard
  admin/                # CMS
  api/ai/               # generation route handlers
  api/adsense/          # optional
  og/
  sitemap.ts
  robots.ts
  layout.tsx
components/
  ui/                   # shadcn
  layout/               # site-header, site-footer, mobile-cta
  hustle/               # cards, filters, blueprint, prompts
  gamification/         # xp-bar, streak, rank-badge
  ads/                  # adsense-slot
  marketing/            # hero, bento-preview
hooks/
lib/
  supabase/             # server.ts, client.ts, admin.ts, middleware
  ai/                   # providers, credits, hustle-generate
  ads/
  seo/
types/                  # re-export from contracts
contracts/              # schema json + sql (already in repo)
content/seed/           # sample hustles
```

## Data flow

```
AI provider → Zod parse → hustles (draft)
Admin publish → RSC pages /earn/[slug]
/earn board = DB published hustles + seed appended unless earn_include_seed=false (lib/hustle-content.ts, force-dynamic)
Visitor → middleware increment page_views (sampled or batched)
Member checklist → hustle_progress
Member tool run → debit credits → generations cache
Member service brief → service_orders
```

## Auth and RLS (simple rules)

- `hustles` published: `select` for `anon` + `authenticated`.
- Drafts: `admin` only.
- `profiles`, `credits`, `progress`, `orders`: owner read/write.
- `page_views`: insert via service role from a route handler (do not let anon write arbitrary rows).
- `site_settings`: public read of non-secret keys; writes admin only. **Never** put OpenAI/Gemini keys in this table; env only.

## Admin auth (magic link + permanent password)

- First-time sign-in: `signInWithOtp` from `POST /api/admin/magic-link` sends a link (PKCE → `/auth/callback`) and a six-digit code (`verifyOtp`, `type: "email"`). Both are gated by the server-side `ADMIN_EMAILS` allowlist.
- Permanent password: once signed in, set one via `POST /api/admin/set-password` (control room "Permanent password" card). Afterwards `POST /api/admin/password` uses `signInWithPassword` — no email needed. Password is stored in Supabase Auth, not in EarnLoop.
- Session persistence: `proxy.ts` refreshes/rotates the Supabase cookies on **every** `/admin*` and `/api/admin*` request and guards those routes (redirect to `/admin/login` for pages, 401 JSON for APIs). Without it the access token (1h) would only refresh on page loads, which is why sessions felt short-lived.
- Dashboard settings that make sessions comfortable: Supabase → Authentication → Session lifetime ≈ 30 days, Email OTP expiry ≈ 1 hour, and `{{ .Token }}` present in the Magic Link email template.
- Scholarship and hustle data lives in `site_settings` / `hustles`, so admin edits are live without server restarts; only `ADMIN_EMAILS` and env changes need a redeploy.

## Admin CMS coverage

Guide/news (hustles table, `content_type` guide|news), hustles (AI generated + JSON editor), Mobility desk (scholarships + country guides in `site_settings` under `mobility_desk`, see `lib/scholarship-content.ts`), ads/AdMob settings, and the seed-curation toggle. Scholarships are rendered on `/scholarships` (force-dynamic) from the merged desk.

## Credits (simple)

`profiles.credits` integer. Debit in a **single Postgres RPC** `spend_credits(amount, reason, meta)` so two tabs cannot double-spend. Welcome grant on `handle_new_user` trigger.

## Caching (free-tier friendly)

- ISR `revalidate = 60` for directory and news.  
- Cache identical tool prompts in `generations` unique on hash(user-optional, tool, input).  
- Rate limit AI routes: 5/min/user using a `rate_limits` table (window start + count). No Upstash.

## AdSense vs AdMob

- Web: `components/ads/adsense-loader.tsx` (`next/script`, afterInteractive) loads `adsbygoogle.js` when `NEXT_PUBLIC_ADSENSE_CLIENT` is set. Never loaded otherwise.
- Slots: `components/ads/ad-slot.tsx` reads `lib/ads.ts` `getAdsConfig()` and renders env-driven slots (`NEXT_PUBLIC_ADSENSE_CLIENT` + `NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD` / `_IN_ARTICLE` / `_SIDEBAR`). Missing env = labeled placeholder, so the ad layout is always visible.
- Admin: `/admin/ads` (Ads & networks) shows env status, a 4-step AdSense setup guide, and persists `admob_android_app_id` / `admob_ios_app_id` + `adsense_client` in `site_settings` (key `ads`) for future apps.
- AdMob IDs exist for future native apps only; never used in Next.js. `hide_ads_for_plus` can be read from `site_settings` later.
- Alternative networks (Ezoic, Adsterra, Media.net) can swap into `ad-slot.tsx` before AdSense approval.

## Social integration (CMS)

Not a full social suite in v1:

- Share buttons: X, Facebook, LinkedIn, WhatsApp, copy link (Web Share API on mobile).  
- UTM on share URLs.  
- Optional webhook URLs in settings: `discord_webhook`, `telegram_bot` — admin “Announce this hustle” posts title+URL.  
- Open Graph images for every published hustle.

Do not build unofficial Instagram/Facebook posting scrapers.

## Visitor counters

- `page_views`: path, day, count (aggregate upsert).  
- `visitor_stats` view: 24h, 7d, 30d.  
- Public optional “live” number from settings `show_public_visitor_count`.  
- Admin dashboard charts: simple Recharts or CSS bars — keep deps light.

Hash IPs if you ever store them; prefer **not** storing raw IP on free tier. Count via `document.visibility` ping to `/api/vitals` max once per session per path (cookie `el_sid`).

## Environment

See `.env.example`. Vercel: set the same keys (`NEXT_PUBLIC_SITE_URL` should be the live domain, not `localhost`). Supabase Auth → URL Configuration: Site URL must be the live app and Redirect URLs must include both `http://localhost:3000/auth/callback` and the production `https://<project>.vercel.app/auth/callback`. Magic-link redirects resolve via `lib/site-url.ts`: `NEXT_PUBLIC_SITE_URL`, then `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL`, then request headers — localhost is never used for a non-local request. Admin OTP (`{{ .Token }}`) must be present in the Supabase **Magic Link** email template to appear alongside `{{ .ConfirmationURL }}`.

## Quality gates

- `tsc --noEmit`  
- ESLint  
- No secrets in client bundles except `NEXT_PUBLIC_*`  
- Images: `next/image` + remotePatterns for Supabase Storage
