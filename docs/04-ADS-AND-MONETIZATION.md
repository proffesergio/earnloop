# 04 · Ads and monetization guideline

EarnLoop's ads layer is intentionally small on purpose. One ad network for the web (AdSense), one later for the app (AdMob — never loaded in the browser), honest placeholders everywhere, and the verification standard ("is this the official source?") applied to ad units the same way it is to job listings.

## 1. What the non-negotiable is

> Ad slots are **AdSense** in the web app. Persist AdMob app IDs in `site_settings` for later; do not load the AdMob SDK in the browser.

The whole monetization layer is built around that one sentence.

## 2. Where the code lives

| File | Job |
| --- | --- |
| `lib/ads.ts` | `getAdsConfig()`, `AdSlotVariant`, `AD_SETTINGS_KEY = "ads"` |
| `components/ads/ad-slot.tsx` | `AdSlot` — renders the unit or an honest placeholder |
| `components/ads/adsense-loader.tsx` | Loads the AdSense script (`NEXT_PUBLIC_ADSENSE_CLIENT`) |
| `components/ads/ad-slot.tsx` (internal `AdsbyGoogleUnit`) | The actual `<ins class="adsbygoogle">` unit |
| `app/admin/ads/page.tsx` + `ads-manager.tsx` | Admin console for AdSense client id + AdMob app ids |
| `app/api/admin/ads/route.ts` | Persists those values into `site_settings` |
| `app/layout.tsx` | Mounts `<AdSenseLoader />` |

## 3. How a unit actually loads

1. `app/layout.tsx` renders `<AdSenseLoader />`, which injects
   `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=…`
   asynchronously (`next/script` with `afterInteractive`) only when
   `NEXT_PUBLIC_ADSENSE_CLIENT` is set.
2. A page places `<AdSlot variant="leaderboard" />` (or `in-article`, `sidebar`).
3. `AdSlot` asks `getAdsConfig()` for a `client` + the slot id for that variant.
4. If both exist → `AdsbyGoogleUnit` renders the `<ins>` and pushes
   `window.adsbygoogle.push({})` on mount.
5. If either is missing → it renders a **labeled placeholder** ("Ad space. Connect
   Google AdSense in Admin → Ads…") so the layout never collapses or breaks.

Key behavior: `AdSlot` is SSR-safe (renders the placeholder on the server) and
`AdsbyGoogleUnit` runs the `adsbygoogle.push` only in a client effect — the push
never fires during render, so there is no double-push and no crash.

## 4. Adding a new ad placement (the usual task)

1. Pick the nearest existing variant — `leaderboard`, `in-article`, or `sidebar`.
   Prefer reusing one over inventing a slot id: each new slot id needs its own
   AdSense unit and its own drag-through approval.
2. Drop `<AdSlot variant="X" className="…" />` at the seam where an ad is least
   annoying — below the opening paragraph, between list items, or after the
   article body. Never above the fold, never between logo and nav.
3. Verify it renders the placeholder in `npm run dev` (no client yet) — if you
   see "Advertisement / Ad space…", the slot is wired and waiting.
4. Add the real slot id to `site_settings` (Admin → Ads) or
   `lib/ads.ts` defaults so the same variant works everywhere it's used.

In-article placements ("Today's openings" interstitial, the Job detail page,
the Route checklist side rail) live in `components/ads/ad-slot.tsx` and are
reused by `app/(site)/jobs/*`, `app/(site)/news/*`, and
`components/loop/*` where relevant.

## 5. Adding a search/keyword unit or native block

AdSense "in-feed" and "native" ads map to the same `AdsbyGoogleUnit` path — you
choose the format on AdSense's side and give it a slot id; the component's
`data-ad-format` + `data-full-width-responsive` already suit auto format. For a
keyword-targeted block, set the slot id in `lib/ads.ts` and the AdSense-side
targeting; EarnLoop does not bake keywords into the unit markup.

## 6. Environment variables

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-…` id; gates whether the AdSense script loads at all |
| `.env.example` | Keeps the shape; never commit a real `ca-pub-…` |

`getAdsConfig()` reads the client from env and slot ids from `site_settings`
(Admin → Ads), so deploys can whitelist slots without a redeploy.

## 7. AdMob (app) — persisted, not loaded

- Admin → Ads saves `admobAndroid` / `admobIos` into `site_settings["ads"]`.
- The web app **never** loads the AdMob SDK — the saved ids are for the future
  native app onlyholds. When that app ships, the ids are already in settings.

## 8. AdSense approval / "no AdSense yet" mode

Until AdSense approves the site, or if `client`/slot ids are missing, `AdSlot`
shows an honest labeled placeholder. This is deliberate:
- The layout and ads analytics never crash from a missing id.
- The placeholder blocks space without pretending to be a real ad (matches the
  "no lookalike, no scraper" standard).
- Ambient alternatives (Adsterra, Media.net) can substitute the same slot id
  paths later — swap the unit script in `ad-slot.tsx`, not the layout.

## 9. Rules for every ad change

1. **SSR-safe.** New slot markup must render fine server-side (placeholder) and
   only touch `adsbygoogle` in a client effect.
2. **No double-push.** One `push({})` per unit mount; guard against re-running
   on re-render.
3. **Never mock a real ad.** Placeholders are clearly labeled "Advertisement —
   Ad space…". If a real unit would mislead, it's not loaded yet.
4. **Verify before enabling.** Same bar as job listings — confirm the ad-server
   domain is the official one before setting `NEXT_PUBLIC_ADSENSE_CLIENT`.
5. **Keep it small.** One network on the web, one on the app, honest slots.
   Every extra network is new JS, new consent surface, and new risk of a
   misfiring unit.

## 10. Verification checklist before deployment

- [ ] `npm run lint` and `npx tsc --noEmit` pass (ad changes included in ESLint's
      `set-state-in-effect` and SSR checks).
- [ ] `AdSlot` shows the placeholder with no client set (dev).
- [ ] `getAdsConfig()` returns the intended client + slot ids when set.
- [ ] AdSense script loads only when `NEXT_PUBLIC_ADSENSE_CLIENT` is truthy.
- [ ] No AdMob SDK import anywhere in the web bundle.
- [ ] One `adsbygoogle.push` per unit; no double-trigger on re-render.
