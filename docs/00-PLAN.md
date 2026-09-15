# EarnLoop — A–Z product plan

**Working name (locked):** EarnLoop  
**Tagline:** Learn it. Ship it. Loop the earnings.  
**Domain ideas:** `earnloop.app`, `earnloop.co`, `getearnloop.com`

Rejected-but-usable alternates (do not mix in UI): HustleForge, AirStack, SideCraft.

---

## 0. Problem and promise

People drown in “AI side hustle” listicles that do not tell them **what to do on Tuesday**. EarnLoop is a **directory + operating system**: pick a hustle, follow a blueprint, copy prompts, log proof of work, spend credits on tools, then (if logged in) hire EarnLoop services to ship assets they cannot make themselves.

**Value proposition (hero):**  
“Stop collecting ideas. Run a loop — learn a play, ship the asset, earn the first dollar, then repeat.”

---

## 1. Audience

| Segment | Job to be done | Landing angle |
| --- | --- | --- |
| Time-rich, cash-poor | Zero-capital hustles, free AI tools | Difficulty = Easy, capital = $0 |
| Skilled operator | Faster delivery via prompts + services | Services + credit packs |
| Local maker | T-shirts, gifts, print-on-demand | Services merch track |
| Builder | Custom site/app for *their* hustle | Services development briefs |

Primary ICP for v1 copy: **English-speaking solo operators on mobile**, especially South Asia + global remote workers (host timezone is UTC+6 in this workspace, but UI is English-first).

---

## 2. Information architecture and navbar

Sticky header, one primary CTA (`Start a loop` / `See hustles`). After 60% scroll on marketing pages, a **mobile sticky bar** repeats that CTA.

| Item | Route | Guest | Member |
| --- | --- | --- | --- |
| Learn | `/learn` | Guides, how loops work, prompt literacy | Same + progress |
| Earn | `/earn` | Filterable hustle directory | Saved, in-progress, proofs |
| Tools | `/tools` | Tool cards, locked run buttons | Credit-gated generators |
| Services | `/services` | Catalog + “login to brief” | Brief forms, order status |
| News | `/news` | Editorial / AI roundups | Same |
| Pricing | `/pricing` | Free / Loop+ / credit packs | Upgrade, manage |
| Loop | `/app` | Redirect login | XP, streak, active blueprint, credits |
| Admin | `/admin` | 403 | `admin` role only |

Footer: About, Trust, Affiliate disclosure, Privacy, Terms, Contact, social.

**Suggested mega-menu (desktop Earn):** New · $0 to start · Under 2 hours · Remote-only · Local services · Content · Commerce · Apps.

---

## 3. Research-backed conversion system (2025–2026)

Sources synthesized: SaaS landing patterns (intent pages, bento grids, interactive demos, dark UI, single primary CTA, sub-2s load), edtech gamification (XP for mastery not clicks, daily caps, weekly leagues, streak with recovery — not pay-to-win gambling).

### Must-have conversion blocks

1. **Outcome headline** with a number visitors can imagine (“First listing in one sitting”).
2. **Interactive dashboard preview** in the hero (bento: streak, active hustle, credits, latest proof feed) — not a static PNG.
3. **Social proof that is specific:** “142 loops closed this week” from real `proofs` table, not fake counters.
4. **Transparent pricing** on `/pricing` (trust). Free tier must be useful.
5. **Directory as the product:** search + filters above the fold on `/earn`.
6. **Progressive profiling:** guest can browse; email/social only when they **start a loop** or **run a tool**.
7. **One primary CTA** per viewport; secondary is text link.
8. **AdSense** only after content, never covering CTAs; density that will pass AdSense policy.
9. **Share cards** with OG images per hustle (`/earn/[slug]`).
10. **Affiliate disclosure** adjacent to tool recommendations.

### Gamification (effort aesthetic — “earning with real work”)

| Mechanic | Earns | Does not earn |
| --- | --- | --- |
| XP | Completing a blueprint step, submitting a proof URL/screenshot, finishing a daily “ship task” | Page views, ad clicks, sharing spam |
| Streak | Any day with ≥1 XP | Logging in only |
| Rank | Scout → Operator → Loop Lead → Founder | Buying rank |
| Weekly league | XP among people who opted in | Global all-time whale boards |
| Daily XP cap | e.g. 200 | Unlimited grind |

Premium may sell **streak freeze** and **extra credits**, not fake XP. Visual language: progress rings, checklists, “hours logged”, mint/cyan “loop closed” stamps. Motion: Framer Motion on checklist completion and rank-up only — keep `layout` animations light.

---

## 4. Public pages (v1)

### 4.1 Landing `/`

- Hero: headline, sub, dual path (Browse hustles | Start with $0 filter).
- Live bento preview of the Loop dashboard.
- Latest hustles grid (6–9 cards) from Supabase, ISR/revalidate ~60s.
- “How a loop works” 3 steps: Learn → Ship → Earn.
- Tool strip (3 free tools).
- Services teaser (login wall copy).
- Pricing snapshot.
- FAQ + trust (no overnight-riches claims).
- AdSense in-feed **below** the hustle grid if ads enabled in CMS.

### 4.2 Directory `/earn`

Filters (query-string, shareable):

- `difficulty`: easy | medium | hard
- `setupHours`: 0–2 | 2–8 | 8+
- `capital`: 0 | 1-50 | 50-200 | 200+
- `aiTools`: ChatGPT, Gemini, Claude, Midjourney, Canva, etc.
- `category`: content, commerce, freelance, local, apps
- `q`: full-text on title, summary, tags

Cards: badge stack, capital, time, AI tools, XP reward for completion, “loops closed” count.

### 4.3 Detail `/earn/[slug]`

Structured sections mapped 1:1 to JSON:

1. Overview  
2. Who this is for / not for  
3. Step-by-step blueprint (checklist; logged-in users persist checks)  
4. Required AI prompts (copy buttons; some gated for free users)  
5. Monetization strategy  
6. Success metrics (leading + lagging)  
7. Stack / affiliates  
8. Related hustles  
9. Comments later (not v1)

### 4.4 Learn `/learn` and `/learn/[slug]`

Evergreen playbooks (how to validate, how to take a proof photo, prompt hygiene). Same CMS `content_type = guide`.

### 4.5 Tools `/tools` and `/tools/[slug]`

Each tool: name, input schema (Zod), credit cost, output renderer. Guests see demo output; run requires login + credits.

Starter tools (v1):

- Hustle idea expander (Gemini)  
- Offer headline + landing section writer (OpenAI)  
- Prompt pack generator for a chosen hustle  
- Simple T-shirt slogan / gift-card copy (not print fulfillment)

### 4.6 Services `/services`

Catalog: Graphic design, T-shirt / merch art, custom gift cards, website, mobile app, “other brief”. Guest: examples + login CTA. Member: brief form → `service_orders` row → admin pipeline.

### 4.7 News `/news`

Short posts. CMS. Optional AdSense mid-article.

### 4.8 Auth

Supabase social: **Google** required; GitHub optional. Email magic link optional. On first login: grant **welcome credits** (CMS-configurable, default 25).

### 4.9 App `/app`

Member home: streak, XP bar, credits, active hustle, next ship task, proofs, service orders, upgrade.

---

## 5. Admin CMS (v1 — full control)

See [`02-CMS-AND-ADMIN.md`](./02-CMS-AND-ADMIN.md). Admin can CRUD all content (guides, news, hustles, plus the Mobility desk scholarships/study plans stored in `site_settings`), toggle features, set AdSense/AdMob IDs, social share defaults, visitor stats, users, credits, orders, affiliates. Admin auth: magic link/OTP first, then a permanent password via `signInWithPassword` (see `docs/01-ARCHITECTURE.md`).

---

## 6. Monetization (all enabled in data model)

| Stream | v1 behavior |
| --- | --- |
| Freemium content | Overview + first 2 steps public; remaining steps + full prompt pack = Loop+ or credits |
| Subscription | `loop_plus` monthly/yearly (Stripe later; until then, admin-granted entitlements) |
| Credits | Welcome pack + purchasable packs (admin can gift) |
| Services | Orders in DB; payment link field until Stripe Checkout |
| Ads | AdSense slots; respect `ads_enabled` and `hide_ads_for_plus` |
| Affiliates | `affiliate_url` on tools/hustles; disclosure component |

Honesty: Vercel/Supabase free + platform AI keys means **rate-limit hard** and cache generations.

---

## 7. AI content framework

- Authors (or cron-on-demand from admin “Generate hustle”) call `/api/ai/hustle` with a topic.  
- Model returns JSON **validated by Zod against** `contracts/side-hustle.schema.json`.  
- Invalid JSON is rejected; admin sees errors, nothing unpublished.  
- Store `raw_model`, `prompt_version`, `status: draft|review|published`.  
- Human admin must **Publish**. Never auto-publish AI to the live directory.

Free-tier AI strategy: Gemini Flash as default (cheaper), OpenAI for copy-sensitive tools. Switch in `site_settings.ai_default_provider`.

---

## 8. Design system

- Background: near-black `#07090C`, surface `#0E1318`, border subtle.  
- Accent: electric cyan `#22D3EE` (AI + earn). Secondary: lime `#A3E635` for “loop closed”. Danger: rose.  
- Type: Plus Jakarta Sans headlines, Inter body.  
- Cards: 1px border, no heavy glow. Badges for difficulty/capital.  
- Motion: 150–250ms, respect `prefers-reduced-motion`.  
- shadcn: button, card, badge, dialog, dropdown, sheet, tabs, form, input, skeleton, sonner, table, checkbox, select, tooltip, avatar, progress, separator.

---

## 9. SEO and trust

- `metadataBase` from `NEXT_PUBLIC_SITE_URL`  
- Unique title template `%s · EarnLoop`  
- JSON-LD `ItemList` on directory, `Article` on hustles  
- `sitemap.ts`, `robots.ts`  
- OG route `app/og/[slug]/route.tsx`  
- Affiliate FTC-style disclosure  
- Privacy + cookie note for AdSense  

---

## 10. Phased build order (for the next coding session)

**Phase A — repo bootstrap:** Next.js, Tailwind, shadcn, fonts, theme, layout, nav, empty routes.  
**Phase B — contracts + seed:** Zod, sample hustles JSON, typed cards + detail renderer (can start with static JSON if Supabase not wired).  
**Phase C — Supabase:** schema SQL, auth, RLS, seed.  
**Phase D — directory + landing conversion.**  
**Phase E — credits + 2 AI tools.**  
**Phase F — admin CMS.**  
**Phase G — services briefs + visitor counter + AdSense slots + social share.**  
**Phase H — gamification persistence (XP, streak, proofs).**

Do not skip Zod validation. Do not add Redis. Do not load AdMob in web.

---

## 11. Success metrics (product)

North star: **loops closed / week** (proofs with status approved).  
Secondary: D1/D7 return, tool runs / credit, directory → detail CTR, login conversion from “Start a loop”, AdSense RPM (after approval).

---

## 12. Legal / policy (implement pages, not legal advice)

Privacy, Terms, Affiliate disclosure, AI-content notice (“blueprints are educational; income not guaranteed”), AdSense restricted-category care (no miracle income claims in ad-adjacent copy).
