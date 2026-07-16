import 'server-only';

import type { Domain, Project, Skill, User } from '@/lib/mock/types';
import { createClient } from '@/lib/supabase/server';

import { prisma } from './prisma';

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

// See prisma/schema.prisma's Project doc comment: description is a single Text
// column, paragraphs joined with "\n\n" on write, split on "\n\n" on render here.
function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    ownerId: row.ownerId,
    title: row.title,
    pitch: row.pitch,
    description: row.description.split('\n\n'),
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

/** Trivial "slice the list" suggestion logic — not the weighted scoring algorithm
 * from the original architecture spec, which is out of scope this phase. */
export async function getSuggestedPeople(currentUserId: string, limit = 3): Promise<User[]> {
  const rows = await prisma.user.findMany({
    where: { id: { not: currentUserId } },
    select: USER_SELECT,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(mapUser);
}

export async function getSuggestedProjects(currentUserId: string, limit = 2): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { isPublic: true, ownerId: { not: currentUserId } },
    include: PROJECT_INCLUDE,
    take: limit,
    orderBy: { updatedAt: 'desc' },
  });
  return rows.map(mapProject);
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
