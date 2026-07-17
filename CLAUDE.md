# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Pakkam Project — a discovery-and-collaboration platform for side projects (post a project/idea, find collaborators by skill, message each other). Next.js 14 (App Router) + TypeScript + Tailwind CSS, with a real Supabase backend (Postgres + Auth + Realtime) via Prisma.

Phase 1 built the 4 core screens (Home, Project Detail, Post a Project, Profile) against mock data. Phase 2 added real sign-up/log-in and direct messaging, and migrated all 4 screens off mock data onto the real database. Phase 3 (current) added real collaboration requests, a weighted matching algorithm, an Edit Profile screen, live unread-message badges, rich-text project descriptions, and removed all seed/placeholder data from production — see "What's still mocked" below for the few things deliberately left as-is.

## Commands

Requires `.env.local` (gitignored, not committed — recreate it if missing) with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL` (Supabase pooled/pgbouncer connection string, port 6543), and `NEXT_PUBLIC_APP_URL`. Without these, `npm run dev` runs but every data-fetching route throws (Prisma/Supabase client init fails).

```bash
npm run dev        # start dev server (falls back to :3001, :3002... if :3000 is taken)
npm run build       # production build; also runs type-checking and linting
npm run lint        # next lint
npx tsc --noEmit    # type-check only
npx prisma generate # regenerate the Prisma client after editing prisma/schema.prisma
SEED_CONFIRM=yes-seed-demo-data npx prisma db seed  # upsert demo content from lib/mock/* (safe to re-run — see prisma/seed.ts)
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

**`Project.description` is a single `String @db.Text` holding sanitized HTML** (not `string[]` paragraphs like the old mock shape, and no longer plain text as of Phase 3 — see "Rich-text project descriptions" below). `lib/data/index.ts`'s `mapProject()` passes it through as-is; render it with `dangerouslySetInnerHTML`, never `.map()` over it.

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
- **Unread nav badges (Phase 3)** extend the same broadcast mechanism: `public.broadcast_message_change()` also loops over every other conversation participant and broadcasts to their own `user:<supabaseId>` topic, authorized by an additive RLS policy on `realtime.messages` (`split_part(realtime.topic(), ':', 1) = 'user' AND split_part(realtime.topic(), ':', 2) = (select auth.uid())::text`). `lib/stores/useUnreadStore.ts` (zustand) tracks a `Set` of unread conversation ids; `components/providers/UnreadProvider.tsx`, mounted once in `app/(main)/layout.tsx`, hydrates it from server-fetched state and subscribes to the per-user topic, skipping the currently-open thread via a `pathnameRef` synced to `usePathname()`. `NavItem`/`Sidebar`/`BottomNav` render the count as a pill (works in the icon-only 768–1200px rail too).
  - **Two real races here, both fixed, worth knowing if you touch this area again:** (1) `MessageThread.tsx`'s mount effect must clear `useUnreadStore` directly (`markRead(conversationId)`), not just call the server-side `markConversationRead` — the server call alone never told the client-side store, so the badge didn't clear on first open. (2) On a *hard* navigation straight into a thread (not a soft `<Link>` nav), `app/(main)/layout.tsx` — and therefore `UnreadProvider` — remounts, and its hydrate effect fires using the server-computed unread list from *before* the client had a chance to call `markConversationRead`. Since React fires child effects before parent effects, that hydrate (the parent) runs *after* `MessageThread`'s clear (the child) and clobbers it back to unread. Fixed by filtering the currently-open conversation out of `initialUnreadConversationIds` at hydrate time (`UnreadProvider` already tracked `pathnameRef` for the equivalent check in its broadcast handler) — this doesn't depend on effect ordering, so it's robust regardless of mount-order changes elsewhere.

### Row Level Security — what's real vs. default-deny

All tables have RLS enabled (required by Supabase's advisor checks), but only three have real policies with actual logic, because only these are ever queried by a browser-side Supabase client (the Realtime path): `Message`, `Conversation`, `ConversationParticipant` (participant-only `SELECT`), plus `realtime.messages` (broadcast authorization) and a narrow `"users can read their own row"` policy on `User` (needed by `middleware.ts`'s PostgREST-based `profileComplete` check). Every other table — `Project`, `Skill`, `Domain`, join tables, `CollabRequest`, `Collaboration` — is RLS-enabled with **no policies** (default-deny for the anon/authenticated roles), which is correct: all reads/writes for those go through trusted server-side Prisma (`DATABASE_URL`), which connects directly to Postgres and bypasses PostgREST/RLS entirely. Don't "fix" the resulting `rls_enabled_no_policy` advisor INFOs by adding permissive policies — nothing legitimate needs browser-side access to those tables.

All RLS policies wrap `auth.uid()`/`realtime.topic()` calls as `(select auth.uid())` — this is a Postgres query-planner optimization Supabase's advisor flags (`auth_rls_initplan`) if omitted; keep this pattern in any new policy.

### Collaboration requests (Phase 3)

`app/(main)/projects/[id]/actions.ts` — `sendCollabRequest`, `getMyCollabRequestStatus`, `getPendingCollabRequests` (owner-only, re-derives ownership server-side from `getCurrentUser()`, never trusts the caller), `respondToCollabRequest` (idempotent against double-click — no-ops if already resolved). Accept does a `prisma.$transaction` (update `CollabRequest.status = 'ACCEPTED'` + create the `Collaboration` row), then *outside* the transaction sends an automated "🎉 You've been accepted onto `<project>`!" DM by calling `getOrCreateDmConversation`/`sendMessage` from `../../messages/actions` — reuses the existing messaging infra rather than a separate notification system. Decline just updates status, no DM.

The owner-review UI lives in the same right-column slot on the project's own detail page as the request-to-join card, branched via `isOwner` in `app/(main)/projects/[id]/page.tsx`: `IncomingRequestsCard` (owner) vs. `RequestToCollaborateCard` (everyone else, now backed by real `sendCollabRequest`/`getMyCollabRequestStatus` instead of the old mocked `setTimeout`). Still explicitly out of scope: project-room group chats.

### Weighted matching algorithm (Phase 3)

`lib/matching.ts` — pure scoring functions, no Prisma I/O: `scoreProjectMatch`/`scorePersonMatch` (`skillOverlap * 3 + domainOverlap * 2 + availabilityMatch * 2`), `rankByScore` (stable sort + slice). `lib/data/index.ts`'s `getSuggestedPeople`/`getSuggestedProjects` fetch a bounded candidate pool (`CANDIDATE_POOL_SIZE = 50`, most-recent-first), score in JS, sort, slice — justified by scale (small pool, join data already fetched for the mapper regardless; revisit only if the user base grows to thousands). Signatures take the already-fetched `currentUser: User` rather than `currentUserId: string`, avoiding a redundant lookup at the `home/page.tsx` call sites. `getSuggestedProjects` also excludes any project the current user has a `PENDING` or `ACCEPTED` `CollabRequest` for.

### Edit Profile (Phase 3)

Route is `/profile/edit` (not `/profile/[username]/edit`) — always resolves the acting user via `getCurrentUser()`, no username param to guard against tampering, same pattern as `/onboarding`. Reuses the onboarding form machinery rather than duplicating it: `hooks/useProfileFieldsForm.ts` (renamed/generalized from the old `useOnboardingForm.ts`, added a `headline` field) + `components/profile/ProfileFieldsFieldset.tsx` (shared bio/availability/location/skills/domains JSX, `includeHeadline?` prop — onboarding itself renders unchanged, headline only shows on the edit form). `app/(main)/profile/edit/actions.ts`'s `saveProfile` mirrors `saveOnboarding`'s transaction shape but does **not** touch `profileComplete` and redirects to `/profile/<username>`, not `/home`. Editable: headline, bio, location, availability, skills, domains — not username/email (identity-defining, out of scope).

### Rich-text project descriptions (Phase 3)

`components/project/post-form/DescriptionSection.tsx` is a real Tiptap `useEditor()` instance (`immediatelyRender: false` — required to avoid an SSR hydration mismatch under the App Router) using hand-picked extensions only (`Document`, `Paragraph`, `Text`, `Bold`, `Italic`, `BulletList`, `ListItem`, `Placeholder`) rather than the `StarterKit` kitchen-sink preset, so "no headings" etc. is enforced by what's imported rather than remembered. Toolbar buttons need `onMouseDown={(e) => e.preventDefault()}` — without it the browser moves focus to the button on mousedown, before `onClick` fires, collapsing the editor's text selection so the format command applies to a stray cursor instead of the selection.

`lib/sanitizeHtml.ts`'s `sanitizeDescription()` (via `isomorphic-dompurify`, not plain `dompurify` — the write path runs in Node via a Server Action with no DOM) has an explicit tag allowlist (`p`, `strong`, `em`, `ul`, `li`, no attributes) matching exactly what those extensions can emit, and runs server-side in `projects/new/actions.ts`'s `createProject` immediately before the write — so a client bypassing the editor UI can't smuggle in arbitrary HTML.

**Real, reproduced editor bug, now fixed:** pressing the native `End` key right after a Bold/Italic-marked run at the end of a line, then `Enter`, silently dropped that entire marked text node — confirmed via isolated repro (swapping `End` for `ArrowRight`-to-the-same-position didn't trigger it, so this wasn't a headless-browser/automation artifact). ProseMirror has no built-in End/Home keymap, so without an override the browser's native contenteditable `End` handling ran, and whatever DOM selection it produced at a mark boundary got mis-synced back into the editor's document model, corrupting the next edit. Fixed with a small custom extension (`FixEndHomeKeys` in `DescriptionSection.tsx`) that resolves End/Home via ProseMirror's own `$pos.end()`/`$pos.start()` position math instead of relying on native caret movement — sidesteps the DOM-sync step entirely. If you add more toolbar formatting or keyboard shortcuts to this editor, keep this extension in the list.

### Custom Tailwind breakpoints (Phase 1, unchanged)

`tailwind.config.ts` extends the default `screens` scale with `tablet: '768px'` and `desktop: '1200px'`. `≥1200px` full sidebar; `768–1200px` icon-only 64px rail; `<768px` sidebar hidden, `BottomNav` takes over. Sidebar/BottomNav's "Messages" nav item is now a real link (`/messages`) — it used to be disabled/non-interactive in Phase 1.

**Screenshot-tool gotcha (still applies):** full-page screenshots render `position: fixed`/`sticky` elements at their last on-screen viewport position, which can look like a bug (e.g. BottomNav floating mid-page) when it isn't — verify with a real scrolled viewport capture instead.

### Server/Client component boundary

Screens are `async` Server Components fetching via `lib/data`. `'use client'` only where genuinely needed: form/filter state, `TagPicker`, `PostProjectForm`, `Sidebar`/`BottomNav` (`usePathname`), auth forms (`signup`/`login` call `supabase.auth.*` directly from the browser client), `MessageThread`/`useMessages` (Realtime), `MessageButton`, `SignOutButton`.

### Form state

No `react-hook-form` anywhere — `usePostProjectForm.ts` and `hooks/useProfileFieldsForm.ts` (shared by onboarding and Edit Profile) both use a plain `useReducer` with a typed action union. Follow this pattern for new forms rather than introducing a form library.

## What's still mocked / out of scope (don't assume otherwise)

- **`components/profile/PastCollaborationsGrid.tsx`** still renders hardcoded fake `mockPastCollaborations` on every profile regardless of whose it is — flagged during Phase 3 planning as more visibly wrong now that `Collaboration` is a real table, but explicitly left out of scope rather than fixed speculatively.
- **No avatar/file upload** — `Avatar` still falls back to initials for everyone; Supabase Storage isn't wired up.
- **No OAuth** — email/password only.
- **No project-room group chats** — `Conversation.type` includes `PROJECT_ROOM` in the schema for future-proofing, but no code path creates one; messaging is DMs only.
- Editable identity fields on Edit Profile stop at username/email — changing those is out of scope (see "Edit Profile" above).

All of "Send Request" (real `CollabRequest`/`Collaboration` logic), Edit Profile, weighted matching, unread badges, and rich-text descriptions — previously listed here as mocked — were built in Phase 3; see the architecture sections above.

## Known accepted advisories

Running `mcp__claude_ai_Supabase__get_advisors` will show: `rls_enabled_no_policy` INFOs (intentional, see RLS section), `unused_index` INFOs on FK-covering indexes with little/no traffic yet, and two WARNs left as manual dashboard follow-ups rather than automated: `auth_leaked_password_protection` disabled (HaveIBeenPwned check — Auth-service setting, not a SQL fix) and `anon`/`authenticated`-executable `SECURITY DEFINER` functions (`handle_new_user`, `is_conversation_participant`) being callable directly via PostgREST RPC — low real risk (boolean-only/trigger-context functions, no data leak) but tightening would mean moving them out of the `public` schema, which risks destabilizing the Realtime authorization path; flagged here rather than done reflexively.
