# Content, SEO, and ad-placement guidelines

How to publish content through the EarnLoop CMS so it drives qualified traffic, ranks, converts, and stays honest. Read this before writing or publishing any content type.

## Voice and honesty rules

- Never promise overnight income. Ban “make $10k overnight” copy. Prefer “first $1 proof”, “hours to first listing”, “tools you already have”.
- Be specific and honest about effort and capital. Every guide states what it really costs, in money and hours, before the first result.
- Gamification rewards completed work (checklists, proofs, loops closed), never idle clicks. Content must never imply passive income without labor.
- Distinguish facts, experience, and opinion. Cite or link the official source for anything about money, visas, scholarships, or immigration.
- No feel-good filler. Every page should end with one decision or action the reader can take.

## Content types and where they render

| Type | Admin surface | Public route | Publish control |
| --- | --- | --- | --- |
| Side-hustle blueprint | Admin → Hustles (or HustleStudio AI) | `/earn/[slug]` | `status = published` |
| News / guide post | Admin → Guides & News (with category + SEO fields) | `/news/[slug]` | `content_type` + published |
| Scholarship / mobility | Admin → Mobility desk (including Import tools) | `/scholarships/[slug]` | whole-desk save / import merge |
| Opportunity board | Admin → Jobs & gigs | `/jobs/[slug]` | whole-board save |
| Prompt library | Admin → Prompts & library | `/prompts` | code seed + active additions |
| Tools catalog | Admin → Tools catalog | `/tools` | enabled flag |
| Static learning guides | `lib/earning.ts` | `/learn` | code change |

Admin publishes a draft; public routes only show published content. After publishing, verify the page in a fresh anonymous session and run the checklist below.

## SEO checklist (every content type)

1. **Title** — under 60 characters, includes the primary phrase and a concrete benefit.
2. **Description** — under 155 characters, states the promise and the proof.
3. **Slug** — short, hyphenated, matches the topic phrase exactly.
4. **Canonical + OG** — page titles/descriptions render canonical, OpenGraph, and Twitter meta automatically via `lib/seo.ts::pageMetadata()`; keep the H1 in sync with the metadata title.
5. **Structured data** — the code emits JSON-LD automatically:
   - `/earn`, `/news`, `/prompts`, `/tools`, `/scholarships`, `/jobs` → `ItemList`
   - `/earn/[slug]`, `/news/[slug]`, `/scholarships/[slug]`, `/jobs/[slug]` → `Article` + `BreadcrumbList`
   - Do not hand-edit or duplicate these scripts on a page.
6. **Semantic HTML** — one `h1` per page, heading order without skips, real `ul`/`ol`/`section` where they belong.
7. **Internal linking** — every content page links onward in the loop: news → earn, prompts → earn/tools, earn detail → tools, learn → prompts. Add at least one contextual internal link to a published page per 300 words.
8. **Verify** — paste the live URL into Google’s Rich Results Test (`search.google.com/test/rich-results`) and Search Console URL Inspection after publish.

## Ad placement

Ads are **ready by default**: every placement renders even with no publisher configured (a labeled placeholder appears). Config is a simple two-part system:

- **Live web ads** come from environment variables (see `.env.example`):
  - `NEXT_PUBLIC_ADSENSE_CLIENT` — publisher ID (`ca-pub-…`)
  - `NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD` / `_IN_ARTICLE` / `_SIDEBAR` — slot IDs
- **Records** live in Admin → Ads (Supabase `site_settings`) for bookkeeping and the future native app; the web renders the environment values.

Current slot map:

| Slot | Locations |
| --- | --- |
| `leaderboard` | top of `/earn`, `/prompts`, `/jobs`, scholarship country guides |
| `in-article` | middle of news posts, scholarship details, job listings, inside `/tools`, every 9th prompt card, every 8th job card |
| `sidebar` | desktop sidebar rail on long-form scholarship pages and job details |

Placement rules:

- Max 3 units on any single page; never insert one on top of a CTA, form, or the copy-to-clipboard prompt.
- Keep in-article breaks between meaningful sections, not mid-sentence.
- The showcase page (Admin → Ads) is the single source of truth for the map; update it when you move a slot.
- AdMob app IDs are stored in `site_settings` for the future app build only — never load the AdMob SDK in the browser.

## Publishing checklist

1. Draft in the admin CMS, fill title/description/slug/SEO fields.
2. Run the honest-audit: is there real effort, a real cost band, and a first-proof path?
3. Add internal links to at least one live page.
4. Publish, then open the public URL anonymously.
5. Check the Rich Results Test for the JSON-LD and the meta description length.
6. Announce only in the app’s own channels; paid traffic follows the same copy rules.

## Traffic sources

- **Contents / posts** — the `/news` journal is the evergreen traffic surface; publish 1–2 per week. Use the admin **News categories** chips to keep posts grouped by real topics (tech, football, sports, AI, medical, science, astro & space, etc.), and fill the optional **On-page SEO** meta title / meta description per post for the detail pages (/news/[slug]).
- **Jobs and earning ideas** — the `/jobs` board is the discovery surface for remote roles, virtual assistance, data entry, writing, creative and social media gigs, side-hustle loops and earning ideas; per-listing SEO overrides and categories make the board search-friendly from day one.
- **AI tips** — the `/prompts` library is the “try it free” surface that funnels to tools and blueprints; the seed ships with the app and Admin → Prompts & library adds more by category.
- **Imported mobility lists** — Admin → Import tools pulls fresh opportunity links from listing sites (or pasted HTML for blocked pages) and merges them into the Mobility desk. Always open the source link to verify criteria and deadline before publishing imported items.
- **Tools** — `/tools` is the credit-gated surface; blueprint and prompt pages point users to it.
- **SEO** — structured content clusters: one pillar + supporting posts, all internally linked.
- **Ads** — AdSense on the surfaces above; no ad is needed to render a page.