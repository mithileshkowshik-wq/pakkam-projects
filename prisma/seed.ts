import { randomUUID } from 'node:crypto';

import { PrismaClient } from '@prisma/client';

import { DOMAINS } from '../lib/mock/domains';
import { PROJECTS } from '../lib/mock/projects';
import { SKILLS } from '../lib/mock/skills';
import { USERS } from '../lib/mock/users';

const prisma = new PrismaClient();

// This app has exactly one Postgres database (the live Supabase project — there's no separate
// local/dev instance, see CLAUDE.md), so a DATABASE_URL-based "is this prod?" check would be
// either always-true or a fictitious marker. This gate exists purely as deliberate friction
// against running the script at all by accident, not as an environment check.
const SEED_CONFIRM_VALUE = 'yes-seed-demo-data';

async function main() {
  if (process.env.SEED_CONFIRM !== SEED_CONFIRM_VALUE) {
    console.error(
      `Refusing to run: this seeds/updates rows directly in the one shared database this app uses ` +
        `(there is no separate dev database). If you're sure, re-run with:\n\n` +
        `  SEED_CONFIRM=${SEED_CONFIRM_VALUE} npx prisma db seed\n`,
    );
    process.exitCode = 1;
    return;
  }

  // Upsert-only — never deleteMany() across a whole table. Real users' rows must never be at risk
  // just because this script runs. lib/mock/{skills,domains,users,projects}.ts are imported
  // directly (not retyped) to preserve the curated copy verbatim and avoid transcription drift —
  // see CLAUDE.md.
  for (const s of SKILLS) {
    await prisma.skill.upsert({
      where: { id: s.id },
      create: { id: s.id, name: s.name, category: s.category },
      update: { name: s.name, category: s.category },
    });
  }
  for (const d of DOMAINS) {
    await prisma.domain.upsert({
      where: { id: d.id },
      create: { id: d.id, name: d.name, emoji: d.emoji },
      update: { name: d.name, emoji: d.emoji },
    });
  }

  for (const u of USERS) {
    const scalarData = {
      username: u.username,
      name: u.name,
      headline: u.headline,
      bio: u.bio,
      avatarUrl: u.avatarUrl,
      location: u.location,
      availabilityLevel: u.availabilityLevel,
      openToCollaborate: u.openToCollaborate,
      profileComplete: true,
    };
    await prisma.user.upsert({
      where: { id: u.id },
      create: {
        id: u.id,
        // Synthetic, non-loggable placeholder — these seed users are browsable content
        // (profiles/project owners), not real accounts. Real test accounts for exercising
        // signup/login/messaging are created through the actual /signup flow instead.
        supabaseId: `seed-${randomUUID()}`,
        ...scalarData,
        skills: { create: u.skills.map((s) => ({ skillId: s.id })) },
        domains: { create: u.domains.map((d) => ({ domainId: d.id })) },
      },
      // On re-run, only touch this one already-known seed user's own join rows — never a
      // table-wide deleteMany. Scoped automatically to this user via the relation.
      update: {
        ...scalarData,
        skills: { deleteMany: {}, create: u.skills.map((s) => ({ skillId: s.id })) },
        domains: { deleteMany: {}, create: u.domains.map((d) => ({ domainId: d.id })) },
      },
    });
  }

  for (const p of PROJECTS) {
    const scalarData = {
      ownerId: p.ownerId,
      title: p.title,
      pitch: p.pitch,
      // lib/mock/projects.ts already stores this as sanitized-by-construction HTML
      // (hand-authored <p> tags) — no transform needed, matches the real write path's shape.
      description: p.description,
      stage: p.stage,
      commitmentLevel: p.commitmentLevel,
      collaborationStyle: p.collaborationStyle,
      tools: p.tools,
      isOpenToCollabs: p.isOpenToCollabs,
      isPublic: p.isPublic,
      viewingCount: p.viewingCount ?? 0,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    };
    await prisma.project.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        ...scalarData,
        skills: { create: p.skills.map((s) => ({ skillId: s.id })) },
        domains: { create: p.domains.map((d) => ({ domainId: d.id })) },
        roles: {
          create: p.roles.map((r, i) => ({ id: r.id, title: r.title, description: r.description, order: i })),
        },
        links: { create: p.links.map((l) => ({ id: l.id, label: l.label, url: l.url })) },
        updates: {
          create: p.updates.map((u) => ({ id: u.id, content: u.content, createdAt: new Date(u.createdAt) })),
        },
      },
      // Scoped to this one already-known seed project's own join/role/link/update rows only.
      update: {
        ...scalarData,
        skills: { deleteMany: {}, create: p.skills.map((s) => ({ skillId: s.id })) },
        domains: { deleteMany: {}, create: p.domains.map((d) => ({ domainId: d.id })) },
        roles: {
          deleteMany: {},
          create: p.roles.map((r, i) => ({ id: r.id, title: r.title, description: r.description, order: i })),
        },
        links: { deleteMany: {}, create: p.links.map((l) => ({ id: l.id, label: l.label, url: l.url })) },
        updates: {
          deleteMany: {},
          create: p.updates.map((u) => ({ id: u.id, content: u.content, createdAt: new Date(u.createdAt) })),
        },
      },
    });
  }

  console.log(`Seeded/updated ${SKILLS.length} skills, ${DOMAINS.length} domains, ${USERS.length} users, ${PROJECTS.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
