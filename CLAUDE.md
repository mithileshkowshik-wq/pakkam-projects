# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Pakkam Project — a discovery-and-collaboration platform for side projects (post a project/idea, find collaborators by skill, message each other). This repo currently implements **only the frontend**, built against **mock/local data with no backend**: 4 screens (Home/Discovery Feed, Project Detail, Post a Project, User Profile) on Next.js 14 (App Router) + TypeScript + Tailwind CSS.

There is no database, no auth, no API routes, and no realtime messaging yet. Everything renders from the synchronous in-memory arrays in `lib/mock/`. This is a deliberate phase-one scope, not an oversight — see "Explicitly not built yet" below before adding backend plumbing.

## Commands

```bash
npm run dev      # start dev server (falls back to :3001, :3002... if :3000 is taken — check the terminal output for the actual port)
npm run build    # production build; also runs type-checking and linting as part of the build
npm run lint     # next lint (ESLint, extends next/core-web-vitals + next/typescript)
npx tsc --noEmit # type-check only, faster than a full build
```

There is no test runner configured — no Jest/Vitest/Playwright in `package.json`. If you add tests, add the runner and this section.

To visually verify UI changes (there's no test suite to lean on instead): run `npm run dev`, then load the routes below in a real browser at 1280px (desktop), ~900px (tablet), and ~500px (mobile) widths — the app has custom responsive breakpoints (see below) that only show up at those widths.

Known-good routes for manual/visual checks (IDs come from `lib/mock/projects.ts` / `lib/mock/users.ts`):
- `/home`
- `/projects/project-coop-puzzle-game-prototype`
- `/projects/new`
- `/profile/alex-bennett`

## Architecture

### Layered build-order dependency

The codebase was built bottom-up and each layer only depends on the ones before it — respect this when adding to it:

1. **`tailwind.config.ts`** — all design tokens (colors, radii, shadows, fonts, custom `screens`). Never hardcode a hex color or one-off shadow/radius in a component; add a token here instead. A hex-color grep across `components/`/`app/` should only match intentional inline SVG stroke/fill attributes (e.g. the `Logo` mark).
2. **`lib/mock/`** — typed mock data mirroring an eventual Prisma schema (see "Mock data layer" below).
3. **`components/ui/`** — style-agnostic-consumer primitives (Button, Chip, StatusBadge, Avatar, Card, Input, Textarea, CharCounter, RadioCard, Toggle, TagPicker, EmptyState, SectionDivider, Logo, Typography). Every screen must compose these rather than hand-rolling raw `<div>` badges/chips/cards.
4. **`components/layout/`** (Sidebar, BottomNav, NavItem, UserCard) + `app/(main)/layout.tsx` — the app shell every screen renders inside.
5. **`components/project/`, `components/profile/`, `components/shared/`** — cross-screen shared components (e.g. `ProjectCard` is used by both the Home feed and Profile's Active Projects row via its `compact` prop — don't fork it, extend it).
6. **`app/(main)/{home,projects/[id],projects/new,profile/[username]}/page.tsx`** — the 4 screens, each composing the layers above plus its own screen-local components.

Each `components/*` subfolder has a barrel `index.ts` re-exporting components + their prop types (`export { Foo, type FooProps } from './Foo'`) — follow this convention for new components.

### Mock data layer (`lib/mock/`)

- `types.ts` — `User`, `Project`, `Skill`, `Domain`, `ProjectRole`, `ProjectLink`, `ProjectUpdate`, and enums `Availability`/`ProjectStage`/`CommitmentLevel`. Field names deliberately mirror an eventual Prisma schema so swapping mock selectors for real DB calls later is a low-diff change.
- `skills.ts`, `domains.ts`, `users.ts`, `projects.ts` — literal seed arrays. Content here (names, project pitches, update text) was seeded verbatim from an approved design reference — don't paraphrase existing entries when editing nearby; match the tone of the existing copy for new entries.
- `index.ts` — barrel + the only way screens should read data: `getProjectById`, `getUserByUsername`, `getProjectsByOwner`, `getSuggestedPeople`, `getSuggestedProjects`, and `CURRENT_USER_ID`. **These are all `async function`s even though they resolve synchronously** — this is intentional so page components already `await` them, making a future swap to real fetch/DB calls a no-op at call sites. New selectors should follow the same `async` convention.
- A few fields exist only in mock data and are **not yet in any real backend schema** — flagged inline with comments where used: `User.headline`, Profile's "past collaborations" list (hardcoded locally in `components/profile/PastCollaborationsGrid.tsx`, not in `lib/mock`), and the "open to working on" paragraph (hardcoded in the profile page itself). Don't move these into `lib/mock` casually — they were deliberately kept out of the shared mock schema since they're not real fields yet.
- "Current user" is simulated via `CURRENT_USER_ID` (Alex Bennett) — `isOwner` checks in Profile compare `user.id === CURRENT_USER_ID`. There is no real session/auth.

### Custom Tailwind breakpoints

`tailwind.config.ts` extends (not overrides) the default `screens` scale with `tablet: '768px'` and `desktop: '1200px'`, used via `tablet:`/`desktop:` prefixes. This is separate from Tailwind's stock `md`/`lg`. The responsive model:
- `≥1200px` (`desktop:`) — full sidebar (240px, labels visible), two-column layouts, Home's suggestion rail is a fixed 320px column.
- `768–1200px` — sidebar collapses to a 64px icon-only rail (`Sidebar.tsx`/`NavItem.tsx` hide labels via `hidden desktop:inline`), Home's suggestion rail collapses behind a toggle (`components/shared/SuggestedRail.tsx`).
- `<768px` (below `tablet:`) — sidebar is hidden entirely; `components/layout/BottomNav.tsx` (fixed, `tablet:hidden`) replaces it. `app/(main)/layout.tsx`'s `<main>` needs matching bottom padding (`pb-24 tablet:pb-[34px]`) so content doesn't sit under the fixed nav.

Both `Sidebar` and `BottomNav` derive active-tab state from `usePathname()` and share the same href logic (Home → `/home`, "My Projects" and "Profile" → `/profile/${username}`, "Messages" → intentionally non-interactive/disabled since Messaging isn't built, "Post a Project" → `/projects/new`).

**A recurring gotcha when visually inspecting `position: fixed`/`sticky` elements (BottomNav, Post-a-Project's `SubmitBar`) via a full-page screenshot tool:** stitched full-page screenshots render fixed/sticky elements at their last on-screen viewport position, which can look like they're floating mid-document. This is a screenshot artifact, not a bug — verify fixed/sticky behavior with a real viewport-sized screenshot (scroll, then capture) instead of `fullPage: true`.

### Server/Client component boundary

Screens (`page.tsx`) are `async` Server Components that fetch via `lib/mock` selectors and pass data down as props. `'use client'` is used only where genuine interactivity requires it (state, event-driven filtering, refs) — e.g. `ProjectFeedFilters`, `RequestToCollaborateCard`, `TagPicker`, `PostProjectForm`, `BottomNav`, `Sidebar` (needs `usePathname`). Prefer pure CSS `:focus`/`:focus-visible` over JS-tracked focus state to keep components server-renderable where possible (see `Input`/`Textarea`).

### Form state

`app/(main)/projects/new/` (Post a Project) is the one screen with real client form state, owned by `hooks/usePostProjectForm.ts` (a `useReducer` with a typed action union) and consumed by `components/project/post-form/*` section components via one level of prop drilling (no context/store). It includes a debounced (~1.5s) autosave-timestamp effect for the "Draft saved · ..." indicator. There is no `react-hook-form`/`zod`/`zustand` in this codebase — those are intentionally deferred (see below), so don't reach for them in this screen; extend the existing reducer pattern instead.

## Explicitly not built yet (don't assume it exists)

No `app/api/`, `prisma/`, `middleware.ts`, `lib/supabase/`, `lib/validations/`, `store/`, messaging UI, onboarding flow, or real auth. Concretely:
- "Publish Project" and "Send Request" are mocked with a `setTimeout` delay and inline success UI — nothing persists across a page reload.
- "Edit Profile" and the sidebar's "Messages" nav item are visual-only / disabled (no target screen exists).
- Search input on Home is decorative (not wired to any filtering); the filter chip row next to it (domain/stage/commitment/skill) *is* real, client-side `.filter()` over the mock array.

Dependencies deliberately **not** installed: `react-hook-form`, `zod`, `zustand`, `@prisma/client`, `prisma`, `@supabase/supabase-js`, `@supabase/ssr`, `@tiptap/*`, `dompurify`, `sonner`. If a task requires one of these, that's a signal the task belongs to the backend phase — confirm scope before adding backend dependencies to what is currently a pure frontend/mock-data build.
