# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Pakkam Project — a discovery-and-collaboration platform for side projects (post a project/idea, find collaborators by skill, message each other). Next.js 14 (App Router) + TypeScript + Tailwind CSS, with a real Supabase backend (Postgres + Auth + Realtime) via Prisma.

Phase 1 built the 4 core screens (Home, Project Detail, Post a Project, Profile) against mock data. Phase 2 (current) added real sign-up/log-in and direct messaging, and migrated all 4 screens off mock data onto the real database — see "What's still mocked" below for the few things deliberately left as-is.

## Commands

Requires `.env.local` (gitignored, not committed — recreate it if missing) with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL` (Supabase pooled/pgbouncer connection string, port 6543), and `NEXT_PUBLIC_APP_URL`. Without these, `npm run dev` runs but every data-fetching route throws (Prisma/Supabase client init fails).

```bash
npm run dev        # start dev server (falls back to :3001, :3002... if :3000 is taken)
npm run build       # production build; also runs type-checking and linting
npm run lint        # next lint
npx tsc --noEmit    # type-check only
npx prisma generate # regenerate the Prisma client after editing prisma/schema.prisma
npx prisma db seed  # reseed from lib/mock/* (destructive — wipes and recreates all rows, see prisma/seed.ts)
```

No test runner is configured. Verify changes by running the dev server and driving the actual flow in a browser (or via Playwright ad hoc) — there's no test suite to lean on.

**Schema changes don't use `prisma migrate`.** DDL is applied directly against the Supabase project via the Supabase MCP tools' `apply_migration` (raw SQL), not the Prisma CLI — `DATABASE_URL` only points at the pooled connection (pgbouncer), there's no `DIRECT_URL` configured, and there's no local Postgres. To change the schema: edit `prisma/schema.prisma`, generate the corresponding SQL yourself (e.g. `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` against a scratch empty state, or hand-write the `ALTER`/`CREATE`), then apply it via `apply_migration` against project ref `sfboputflksrqylbposq`. Run `npx prisma generate` afterward so the TS client matches.

Known-good routes for manual checks: `/signup`, `/login`, `/onboarding`, `/home`, `/messages`, `/profile/<username>` (any seeded username, e.g. `alex-bennett`), `/projects/<id>`, `/projects/new`.

## Architecture

### Layered build-order dependency (Phase 1, still holds)

1. **`tailwind.config.ts`** — design tokens + custom `tablet`/`desktop` screens. Never hardcode hex/one-off shadows.
2. **`components/ui/`** — primitives (Button, Chip, StatusBadge, Avatar, Card, Input, Textarea, CharCounter, RadioCard, Toggle, TagPicker, EmptyState, SectionDivider, Logo, Typography). Compose these; don't hand-roll.
3. **`components/layout/`** (Sidebar, BottomNav, NavItem, UserCard, SignOutButton) + `app/(main)/layout.tsx` — the app shell, now auth-gated (see below).
4. **`components/project/`, `components/profile/`, `components/shared/`, `components/messaging/`** — cross-screen shared components.
5. Screens under `app/(main)/`, `app/(auth)/`, `app/(onboarding)/`.

Each `components/*` subfolder has a barrel `index.ts` re-exporting components + prop types — follow this for new components.

### Data layer: `lib/data/` (real, Prisma-backed) vs `lib/mock/` (seed source only)

`lib/mock/{skills,domains,users,projects}.ts` are **not dead code** — `prisma/seed.ts` imports them directly as the canonical, curated seed content (preserves copy verbatim, avoids transcription drift). `lib/mock/types.ts` is still the canonical `User`/`Project`/etc. TypeScript shape, re-exported by `lib/data/index.ts`. But `lib/mock/index.ts`'s selector functions and the `USERS`/`PROJECTS` in-memory arrays are **no longer read by any page** — everything now goes through `lib/data/`.

`lib/data/index.ts` (`import 'server-only'`) is the real data-access layer, Prisma-backed, exposing the same async-selector shapes the mock layer originally established: `getProjectById`, `getUserByUsername`, `getProjectsByOwner`, `getSuggestedPeople`, `getSuggestedProjects`, plus two new ones: `getFeedProjects()` (replaces the old raw `PROJECTS` import — powers Home's feed, capped at 100, no pagination UI) and `getCurrentUser()` (reads the Supabase session server-side via `lib/supabase/server.ts`, maps `supabaseId → User`; replaces the old `CURRENT_USER_ID` constant entirely). `getDomains()`/`getSkills()` also live here.

`lib/data/prisma.ts` exports the `PrismaClient` singleton (standard dev-hot-reload-safe pattern via `globalThis`). Import `prisma` from here for any new Prisma query — don't `new PrismaClient()` elsewhere.

**`Project.description` is a single `String @db.Text` in the real schema** (not `string[]` like the old mock shape) — paragraphs are joined with `"\n\n"` on write and split on `"\n\n"` on render. `lib/data/index.ts`'s `mapProject()` does the split; `app/(main)/projects/new/actions.ts`'s `createProject` writes the form's single description string as-is (the Post-a-Project form was already one textarea, no join needed there). If you touch either write or read path, keep this convention in sync.

Prisma's generated types return nullable columns as `T | null`; `lib/mock/types.ts`'s shapes use `T | undefined` (optional fields). `lib/data/index.ts`'s `mapUser`/`mapProject`/`mapSkill`/`mapDomain` do the `?? undefined` normalization — don't return raw Prisma rows to components without going through these mappers.

`lib/validations/{auth,project,message}.ts` hold the zod schemas for every real server-side write (signup/login field validation, `createProject`, `sendMessage`) — this is the hard-enforcement layer behind the UI's soft client-side limits (e.g. title ≤80 chars is also checked in the reducer, but the zod schema is what actually rejects a bad write). Add new schemas here rather than validating inline in a Server Action.

### Auth

- `lib/supabase/client.ts` (browser) / `lib/supabase/server.ts` (server, cookie-based) — thin wrappers around `@supabase/ssr`. Use the server client in Server Components/Actions, the browser client only where genuinely client-side (auth forms, the Realtime subscription, sign-out).
- `middleware.ts` (repo root): refreshes the session every request; redirects unauthenticated `(main)` routes → `/login`; authenticated-on-`/login`or`/signup` → `/home`; authenticated + `profileComplete: false` (not on `/onboarding` already) → `/onboarding`; authenticated + complete + on `/onboarding` → `/home`. The `profileComplete` check queries via PostgREST (`supabase.from('User').select('profileComplete')...`), **not Prisma** — Prisma's Node-runtime query engine doesn't work inside Next.js Edge Middleware. This relies on the `"users can read their own row"` RLS policy on `User` (see RLS section below).
- A **Postgres trigger** (`public.handle_new_user`, fires `AFTER INSERT ON auth.users`) creates the matching `public."User"` row automatically whenever `supabase.auth.signUp()` succeeds, reading `name`/`username` out of `options.data`. The signup page does **not** need to (and should not) create the `User` row itself. If `username` collides (`@unique`), the trigger's constraint violation rolls back the *entire* signup transaction — Supabase Auth returns a generic error (something like "Database error saving new user"), which `app/(auth)/signup/page.tsx` maps to a friendly message since the real cause can't be reliably distinguished from the error text.
- `app/(auth)/{signup,login}/page.tsx` + `app/(auth)/layout.tsx` (no Sidebar/BottomNav). `app/(onboarding)/onboarding/page.tsx` + `actions.ts` (Server Action `saveOnboarding`) + `app/(onboarding)/layout.tsx` — bio/availability/location/skills/domains, all optional, "Skip for now" and "Save & continue" both mark `profileComplete: true` (onboarding is a one-time offer, not a recurring gate).
- Email confirmation is **disabled** in Supabase Auth settings for this project (dev-only decision — no transactional-email infra exists; re-enable before any real launch).
- Sign-out: `components/layout/SignOutButton.tsx` exports both a labeled `SignOutButton` (used on the owner's own Profile page, via `ProfileHeaderCard`) and a compact `SignOutIconButton` (used in the sidebar's `UserCard`, desktop-only). It's surfaced in both places because the icon-only tablet rail and the mobile bottom nav have no persistent slot for it.

### Messaging

Direct messages only (no project-room group chats — `Conversation.type` includes `PROJECT_ROOM` in the schema for future-proofing, but no code path creates one). Layout is plain nested routes, not a two-pane inbox: `app/(main)/messages/page.tsx` (list) → `app/(main)/messages/[conversationId]/page.tsx` (thread), matching how every other master/detail flow in this app works (real navigation, not client-side view-swapping).

- `app/(main)/messages/actions.ts` — Server Actions: `getConversations`, `getOrCreateDmConversation` (existence check + transactional create, small accepted race window on rapid double-click, not worth a unique-constraint workaround for a 2-person DM), `getMessages`, `sendMessage` (zod-validated via `lib/validations/message.ts`), `markConversationRead`.
- `hooks/useMessages.ts` (`'use client'`) — owns the message list, optimistic send (temp-id swapped for the real row by exact id, not fuzzy matching), and the Realtime subscription.
- **Realtime uses Supabase's "Broadcast from Database" pattern, not the legacy `postgres_changes` API.** A trigger (`public.broadcast_message_change`, `AFTER INSERT ON "Message"`) calls `realtime.broadcast_changes(...)` to publish to a private channel topic `conversation:<id>`; the client subscribes with `.channel(topic, { config: { private: true } }).on('broadcast', { event: 'INSERT' }, ...)`. **This switch was deliberate, not a style preference:** `postgres_changes` was tried first and silently dropped every event despite a verified-correct JWT, verified-correct grants, and a verified-correct RLS policy function (tested directly via SQL) — this matches Supabase's own current guidance that Broadcast is the more robust mechanism for anything beyond a quick prototype. Don't switch back to `postgres_changes` without a strong reason.
- Before subscribing, the client **must** call `supabase.realtime.setAuth(session.access_token)` — without this, `phx_join` carries no token, `auth.uid()` resolves `NULL` server-side, and the RLS-gated channel join silently fails to authorize (no error, just no events). This is done in `useMessages.ts`'s effect setup.
- A `public.is_conversation_participant(conversationId, supabaseId)` `SECURITY DEFINER` SQL function is the shared authorization primitive — used by RLS policies on `Conversation`, `ConversationParticipant`, `Message`, and `realtime.messages`. It's `SECURITY DEFINER` specifically to break RLS self-recursion: `ConversationParticipant`'s own SELECT policy needs to check `ConversationParticipant` membership, and querying the same RLS-protected table from within its own policy causes "infinite recursion detected in policy" — the security-definer function bypasses RLS for just that internal check.
- "Message" button lives in `components/profile/MessageButton.tsx` (client component, kept separate from the otherwise-server `ProfileHeaderCard` so only this leaf needs `'use client'`), shown on the non-owner branch of `ProfileHeaderCard`.

### Row Level Security — what's real vs. default-deny

All tables have RLS enabled (required by Supabase's advisor checks), but only three have real policies with actual logic, because only these are ever queried by a browser-side Supabase client (the Realtime path): `Message`, `Conversation`, `ConversationParticipant` (participant-only `SELECT`), plus `realtime.messages` (broadcast authorization) and a narrow `"users can read their own row"` policy on `User` (needed by `middleware.ts`'s PostgREST-based `profileComplete` check). Every other table — `Project`, `Skill`, `Domain`, join tables, `CollabRequest`, `Collaboration` — is RLS-enabled with **no policies** (default-deny for the anon/authenticated roles), which is correct: all reads/writes for those go through trusted server-side Prisma (`DATABASE_URL`), which connects directly to Postgres and bypasses PostgREST/RLS entirely. Don't "fix" the resulting `rls_enabled_no_policy` advisor INFOs by adding permissive policies — nothing legitimate needs browser-side access to those tables.

All RLS policies wrap `auth.uid()`/`realtime.topic()` calls as `(select auth.uid())` — this is a Postgres query-planner optimization Supabase's advisor flags (`auth_rls_initplan`) if omitted; keep this pattern in any new policy.

### Custom Tailwind breakpoints (Phase 1, unchanged)

`tailwind.config.ts` extends the default `screens` scale with `tablet: '768px'` and `desktop: '1200px'`. `≥1200px` full sidebar; `768–1200px` icon-only 64px rail; `<768px` sidebar hidden, `BottomNav` takes over. Sidebar/BottomNav's "Messages" nav item is now a real link (`/messages`) — it used to be disabled/non-interactive in Phase 1.

**Screenshot-tool gotcha (still applies):** full-page screenshots render `position: fixed`/`sticky` elements at their last on-screen viewport position, which can look like a bug (e.g. BottomNav floating mid-page) when it isn't — verify with a real scrolled viewport capture instead.

### Server/Client component boundary

Screens are `async` Server Components fetching via `lib/data`. `'use client'` only where genuinely needed: form/filter state, `TagPicker`, `PostProjectForm`, `Sidebar`/`BottomNav` (`usePathname`), auth forms (`signup`/`login` call `supabase.auth.*` directly from the browser client), `MessageThread`/`useMessages` (Realtime), `MessageButton`, `SignOutButton`.

### Form state

No `react-hook-form` anywhere — `usePostProjectForm.ts` and the newer `useOnboardingForm.ts` both use a plain `useReducer` with a typed action union. Follow this pattern for new forms rather than introducing a form library.

## What's still mocked / out of scope (don't assume otherwise)

- **"Send Request" on Project Detail** (`RequestToCollaborateCard`) is still a mocked `setTimeout` + inline success UI — real `CollabRequest` accept/decline logic and project-room group chats were explicitly out of scope for the messaging phase. `CollabRequest`/`Collaboration` tables exist in the schema (for "full migration" completeness) but nothing writes to them.
- **"Edit Profile"** is still a disabled visual-only button — no edit-profile screen exists.
- **Matching/suggestions** (`getSuggestedPeople`/`getSuggestedProjects`) use trivial "take N, excluding self" queries, not the weighted scoring algorithm from the original architecture spec — intentionally out of scope.
- **No avatar/file upload** — `Avatar` still falls back to initials for everyone; Supabase Storage isn't wired up.
- **No OAuth** — email/password only.
- Dependencies still not installed: `zustand` (no unread-badge counts — could be added later, but don't add the store speculatively), `@tiptap/*`/`dompurify` (description is still plain text, not rich HTML).

## Known accepted advisories

Running `mcp__claude_ai_Supabase__get_advisors` will show: `rls_enabled_no_policy` INFOs (intentional, see RLS section), `unused_index` INFOs on the FK-covering indexes added for the messaging/join tables (expected — freshly created, `CollabRequest` in particular has zero traffic since nothing writes to it yet), and two WARNs left as manual dashboard follow-ups rather than automated: `auth_leaked_password_protection` disabled (HaveIBeenPwned check — Auth-service setting, not a SQL fix) and `anon`/`authenticated`-executable `SECURITY DEFINER` functions (`handle_new_user`, `is_conversation_participant`) being callable directly via PostgREST RPC — low real risk (boolean-only/trigger-context functions, no data leak) but tightening would mean moving them out of the `public` schema, which risks destabilizing the Realtime authorization path; flagged here rather than done reflexively.
