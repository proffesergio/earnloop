# Admin CMS — control surface

Route group: `app/admin`. Guard with `profiles.role = 'admin'`. The current route is a UI preview; do not treat its preview button or client-side state as an access control boundary.

## Admin account creation and access controls

The MVP uses a simple **environment-managed admin allowlist**. There is no public admin-registration form, invitation table, or client-side role escalation.

### Configuration

Set this only in local `.env.local` or Vercel project environment variables:

```bash
ADMIN_EMAILS=owner@example.com,editor@example.com
```

Use lowercase, comma-separated email addresses with no spaces where possible. Keep this variable server-only: it must never be named `NEXT_PUBLIC_ADMIN_EMAILS`, rendered into HTML, or imported by a Client Component.

The future Supabase server guard should:

1. Read the authenticated Supabase user.
2. Normalize the user's email to lowercase and trim whitespace.
3. Check exact membership in `ADMIN_EMAILS`.
4. Reject missing, unconfirmed, or non-allowlisted users with `403`.
5. Write the corresponding profile role and `admin_audit` record through a server-side action.

The allowlist is the source of truth for who may administer the CMS. A profile role is a cached application value, not permission by itself.

### Bootstrap, adding, and removing access

- Create or sign in to the approved email through Supabase Auth magic link.
- Add or remove an administrator by editing `ADMIN_EMAILS` in Vercel (or `.env.local` locally), then redeploy/restart so the server receives the new value.
- After changing the list, revoke existing sessions for removed accounts and verify `/admin` with both an allowed and removed address.
- Record allowlist changes in the deployment log or an audit event once the persistent audit action is wired.
- Never use the Supabase service-role key in a browser, and never store secrets or admin credentials in `NEXT_PUBLIC_*` variables.

This approach is intentionally simpler than database invitations for the first release. When the team grows, replace it with expiring server-generated invitations, MFA, and a database-backed audit trail without changing the server-side authorization boundary.

### Required server-side checks

Every admin page, server action, route handler, and storage operation must:

1. Read the Supabase server session.
2. Reject missing or invalid sessions.
3. Check exact membership in the server-only `ADMIN_EMAILS` allowlist and/or the database `is_admin()` check.
4. Validate input with Zod.
5. Perform the mutation with the user session, not an unscoped service-role client.
6. Write an `admin_audit` row after a successful mutation.

RLS remains the final enforcement layer. Hiding navigation, disabling buttons, or checking a role only in a Client Component is not security.

### Operational rules

- Use email magic links for the first release; add MFA before handling payment, identity documents, or bulk user actions.
- Use separate admin identities from personal accounts, a password manager, and recovery codes stored offline.
- Keep the administrator list small; review it monthly and after staff changes.
- Sessions should expire and be revocable. Revoke all sessions when an account is compromised.
- Never request or store passports, OTPs, passwords, full payment-card details, or immigration documents in CMS notes.
- Redact tokens, invite URLs, access tokens, and personal data from logs.
- Admin audit logs are append-only to the UI; only a controlled database migration may retain or remove them.

Layout: left nav, dense tables, shadcn Data Table pattern.

## Nav modules

1. **Overview** — visitors 7d, loops closed, credits spent, AI cost estimate, unpublished drafts.  
2. **Hustles** — CRUD, AI generate, status, featured flag, filters, slug, SEO fields, affiliate URLs.  
3. **Guides / News** — same post type with `content_type`.  
4. **Tools catalog** — slug, credit_cost, input_schema JSON, enabled.  
5. **Services catalog** — pricing display, intake fields, examples gallery.  
6. **Orders** — pipeline: `new → quoted → in_progress → delivered → closed`. Notes.  
7. **Users** — search, role, grant credits, grant `loop_plus` until date, ban.  
8. **Gamification** — XP awards table, daily cap, streak freeze product flag.  
9. **Ads** — AdSense client, slot IDs per placement (`header`, `in_feed`, `article`, `sidebar`), AdMob placeholders, master `ads_enabled`.  
10. **Social** — default share text, OG title suffix, announce webhooks.  
11. **Visitors** — path table, referrers if stored, toggle public counter.  
12. **Settings** — site name, tagline, welcome credits, default AI provider, maintenance mode.  
13. **Affiliates** — network name, cookie days (display only until full tracking).

## AI generate flow (admin)

1. Form: topic, category, difficulty, capital band, must-use tools.  
2. Server action calls Gemini/OpenAI with system prompt: “Return ONLY JSON matching schema version X”.  
3. Zod parse → insert `hustles` draft + `ai_jobs` log (tokens, model).  
4. Admin edits in form (not raw JSON unless they open advanced).  
5. Publish sets `published_at`.

## Permissions

v1: `user` | `admin` only. No editor role until needed.

## Audit

`admin_audit` (actor, action, entity, entity_id, created_at). Insert from server actions. Enough for free tier; no full event bus.
