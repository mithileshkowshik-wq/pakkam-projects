import 'server-only';

import { rankByScore, scorePersonMatch, scoreProjectMatch } from '@/lib/matching';
import type { Domain, Project, Skill, User } from '@/lib/mock/types';
import { createClient } from '@/lib/supabase/server';

import { prisma } from './prisma';

// Candidate pool size for matching (item 3, Phase 3): bounded rather than scanning every user/
// project, scored in JS. Justified by scale — this is a pre-launch app with a small user base;
// revisit with a raw-SQL scoring query only if the candidate pool needs to be the entire table
// (thousands of rows), which in-JS scoring over a bounded, already-joined fetch doesn't need to be.
const CANDIDATE_POOL_SIZE = 50;

export * from '@/lib/mock/types';

const USER_SELECT = {
  id: true,
  username: true,
  name: true,
  headline: true,
  bio: true,
  avatarUrl: true,
  location: true,
  availabilityLevel: true,
  openToCollaborate: true,
  skills: { include: { skill: true } },
  domains: { include: { domain: true } },
} as const;

const OWNER_SELECT = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
  headline: true,
} as const;

const PROJECT_INCLUDE = {
  skills: { include: { skill: true } },
  domains: { include: { domain: true } },
  roles: { orderBy: { order: 'asc' as const } },
  links: true,
  updates: { orderBy: { createdAt: 'desc' as const } },
  owner: { select: OWNER_SELECT },
  collaborations: { include: { user: { select: OWNER_SELECT } } },
} as const;

// Raw Prisma row shapes (nullable columns come back as `| null`, not `| undefined`).
type SkillRow = { id: string; name: string; category: string | null };
type DomainRow = { id: string; name: string; emoji: string | null };

type UserRow = {
  id: string;
  username: string;
  name: string;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  availabilityLevel: User['availabilityLevel'];
  openToCollaborate: boolean;
  skills: { skill: SkillRow }[];
  domains: { domain: DomainRow }[];
};

type ProjectRow = {
  id: string;
  ownerId: string;
  title: string;
  pitch: string;
  description: string;
  stage: Project['stage'];
  commitmentLevel: Project['commitmentLevel'];
  collaborationStyle: string[];
  tools: string[];
  isOpenToCollabs: boolean;
  isPublic: boolean;
  viewingCount: number;
  createdAt: Date;
  updatedAt: Date;
  skills: { skill: SkillRow }[];
  domains: { domain: DomainRow }[];
  roles: { id: string; title: string; description: string | null }[];
  links: { id: string; label: string; url: string }[];
  updates: { id: string; content: string; createdAt: Date }[];
  owner: { id: string; username: string; name: string; avatarUrl: string | null; headline: string | null };
  collaborations: {
    user: { id: string; username: string; name: string; avatarUrl: string | null; headline: string | null };
  }[];
};

function mapSkill(row: SkillRow): Skill {
  return { id: row.id, name: row.name, category: row.category ?? undefined };
}

function mapDomain(row: DomainRow): Domain {
  return { id: row.id, name: row.name, emoji: row.emoji ?? undefined };
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    headline: row.headline ?? undefined,
    bio: row.bio ?? undefined,
    avatarUrl: row.avatarUrl ?? undefined,
    location: row.location ?? undefined,
    availabilityLevel: row.availabilityLevel,
    openToCollaborate: row.openToCollaborate,
    skills: row.skills.map((s) => mapSkill(s.skill)),
    domains: row.domains.map((d) => mapDomain(d.domain)),
  };
}

// See prisma/schema.prisma's Project doc comment: description is sanitized Tiptap HTML, stored
// and rendered as a single string — sanitization happens once at the write boundary (see
// lib/sanitizeHtml.ts and app/(main)/projects/new/actions.ts), not on every render here.
function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    ownerId: row.ownerId,
    title: row.title,
    pitch: row.pitch,
    description: row.description,
    stage: row.stage,
    commitmentLevel: row.commitmentLevel,
    collaborationStyle: row.collaborationStyle,
    tools: row.tools,
    isOpenToCollabs: row.isOpenToCollabs,
    isPublic: row.isPublic,
    viewingCount: row.viewingCount,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    skills: row.skills.map((s) => mapSkill(s.skill)),
    domains: row.domains.map((d) => mapDomain(d.domain)),
    roles: row.roles.map((r) => ({ id: r.id, title: r.title, description: r.description ?? undefined })),
    links: row.links,
    updates: row.updates.map((u) => ({ id: u.id, content: u.content, createdAt: u.createdAt.toISOString() })),
    owner: {
      id: row.owner.id,
      username: row.owner.username,
      name: row.owner.name,
      avatarUrl: row.owner.avatarUrl ?? undefined,
      headline: row.owner.headline ?? undefined,
    },
    collaborators: row.collaborations.map((c) => ({
      id: c.user.id,
      username: c.user.username,
      name: c.user.name,
      avatarUrl: c.user.avatarUrl ?? undefined,
      headline: c.user.headline ?? undefined,
    })),
  };
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const row = await prisma.project.findUnique({ where: { id }, include: PROJECT_INCLUDE });
  return row ? mapProject(row) : undefined;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({ where: { username }, select: USER_SELECT });
  return row ? mapUser(row) : undefined;
}

export async function getProjectsByOwner(ownerId: string): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { ownerId },
    include: PROJECT_INCLUDE,
    orderBy: { updatedAt: 'desc' },
  });
  return rows.map(mapProject);
}

/** Batched, not per-project (N+1) — the My Projects page needs this across every project a user
 * owns, unlike the project-detail page's getPendingCollabRequests which fetches full requester
 * objects for one project's IncomingRequestsCard. */
export async function getPendingCollabRequestCounts(projectIds: string[]): Promise<Record<string, number>> {
  if (projectIds.length === 0) return {};
  const rows = await prisma.collabRequest.groupBy({
    by: ['projectId'],
    where: { projectId: { in: projectIds }, status: 'PENDING' },
    _count: { _all: true },
  });
  return Object.fromEntries(rows.map((r) => [r.projectId, r._count._all]));
}

/** Weighted match (skill/domain overlap + availability), scored in JS over a bounded,
 * most-recent-first candidate pool — see CANDIDATE_POOL_SIZE. */
export async function getSuggestedPeople(currentUser: User, limit = 3): Promise<User[]> {
  const rows = await prisma.user.findMany({
    where: { id: { not: currentUser.id }, openToCollaborate: true },
    select: USER_SELECT,
    take: CANDIDATE_POOL_SIZE,
    orderBy: { createdAt: 'desc' },
  });
  const candidates = rows.map(mapUser);
  return rankByScore(candidates, (c) => scorePersonMatch(currentUser, c), limit);
}

/** Same weighted-match approach as getSuggestedPeople, plus excludes projects the current user
 * already has a pending or accepted collaboration request for (new in Phase 3 — a project you've
 * already asked to join, or joined, isn't a "suggestion" anymore). */
export async function getSuggestedProjects(currentUser: User, limit = 2): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: {
      isPublic: true,
      ownerId: { not: currentUser.id },
      collabRequests: { none: { requesterId: currentUser.id, status: { in: ['PENDING', 'ACCEPTED'] } } },
    },
    include: PROJECT_INCLUDE,
    take: CANDIDATE_POOL_SIZE,
    orderBy: { updatedAt: 'desc' },
  });
  const candidates = rows.map(mapProject);
  return rankByScore(candidates, (p) => scoreProjectMatch(currentUser, p), limit);
}

/** Replaces the raw PROJECTS array import Home's feed used to read directly from
 * lib/mock — ProjectFeedFilters filters this whole list client-side. No pagination
 * UI exists yet, so this is capped rather than paginated. */
export async function getFeedProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { isPublic: true },
    include: PROJECT_INCLUDE,
    orderBy: { updatedAt: 'desc' },
    take: 100,
  });
  return rows.map(mapProject);
}

export async function getDomains(): Promise<Domain[]> {
  const rows = await prisma.domain.findMany({ orderBy: { name: 'asc' } });
  return rows.map(mapDomain);
}

export async function getSkills(): Promise<Skill[]> {
  const rows = await prisma.skill.findMany({ orderBy: { name: 'asc' } });
  return rows.map(mapSkill);
}

/** Replaces CURRENT_USER_ID: reads the real Supabase session server-side and maps
 * supabaseId -> the Prisma User row. Returns undefined if unauthenticated, though
 * middleware.ts guarantees a session on every (main) route in practice. */
export async function getCurrentUser(): Promise<User | undefined> {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return undefined;

  const row = await prisma.user.findUnique({ where: { supabaseId: authUser.id }, select: USER_SELECT });
  return row ? mapUser(row) : undefined;
}
