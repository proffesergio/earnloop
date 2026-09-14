# EarnLoop architecture

## Stack (locked)

| Layer | Choice | Why |
| --- | --- | --- |
| App | Next.js App Router (latest stable) | Vercel, RSC, metadata |
| UI | Tailwind + shadcn/ui + Radix + Lucide | Fast, accessible |
| Motion | Framer Motion | Checklist / rank-up only |
| Validation | Zod | JSON + forms + AI payloads |
| Data | TanStack Query on client; Server Components + server actions for mutations | Cache tool runs, admin tables |
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

## Credits (simple)

`profiles.credits` integer. Debit in a **single Postgres RPC** `spend_credits(amount, reason, meta)` so two tabs cannot double-spend. Welcome grant on `handle_new_user` trigger.

## Caching (free-tier friendly)

- ISR `revalidate = 60` for directory and news.  
- Cache identical tool prompts in `generations` unique on hash(user-optional, tool, input).  
- Rate limit AI routes: 5/min/user using a `rate_limits` table (window start + count). No Upstash.

## AdSense vs AdMob

- Web: `next/script` loads `adsbygoogle.js` when `NEXT_PUBLIC_ADSENSE_CLIENT` or CMS `adsense_client` is set.  
- Slot components read `ad_slots` from settings.  
- `admob_android_app_id` / `admob_ios_app_id` exist for future apps; unused in Next.js.  
- Loop+ members: `hide_ads_for_plus` flag.

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

See `.env.example`. Vercel: set the same keys. Supabase redirect URLs: `http://localhost:3000/auth/callback` and production domain.

## Quality gates

- `tsc --noEmit`  
- ESLint  
- No secrets in client bundles except `NEXT_PUBLIC_*`  
- Images: `next/image` + remotePatterns for Supabase Storage
