import { randomUUID } from 'node:crypto';

import { PrismaClient } from '@prisma/client';

import { DOMAINS } from '../lib/mock/domains';
import { PROJECTS } from '../lib/mock/projects';
import { SKILLS } from '../lib/mock/skills';
import { USERS } from '../lib/mock/users';

const prisma = new PrismaClient();

async function main() {
  // Idempotent: clear in FK-dependency order (children before parents) so this can be re-run
  // freely during development without unique-constraint collisions on the same seed ids.
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.collabRequest.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.projectUpdate.deleteMany();
  await prisma.projectLink.deleteMany();
  await prisma.projectRole.deleteMany();
  await prisma.projectSkill.deleteMany();
  await prisma.projectDomain.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.userDomain.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.domain.deleteMany();

  // lib/mock/{skills,domains,users,projects}.ts are imported directly (not retyped) to preserve
  // the curated copy verbatim and avoid transcription drift — see CLAUDE.md.
  await prisma.skill.createMany({
    data: SKILLS.map((s) => ({ id: s.id, name: s.name, category: s.category })),
  });
  await prisma.domain.createMany({
    data: DOMAINS.map((d) => ({ id: d.id, name: d.name, emoji: d.emoji })),
  });

  for (const u of USERS) {
    await prisma.user.create({
      data: {
        id: u.id,
        // Synthetic, non-loggable placeholder — these seed users are browsable content
        // (profiles/project owners), not real accounts. Real test accounts for exercising
        // signup/login/messaging are created through the actual /signup flow instead.
        supabaseId: `seed-${randomUUID()}`,
        username: u.username,
        name: u.name,
        headline: u.headline,
        bio: u.bio,
        avatarUrl: u.avatarUrl,
        location: u.location,
        availabilityLevel: u.availabilityLevel,
        openToCollaborate: u.openToCollaborate,
        profileComplete: true,
        skills: { create: u.skills.map((s) => ({ skillId: s.id })) },
        domains: { create: u.domains.map((d) => ({ domainId: d.id })) },
      },
    });
  }

  for (const p of PROJECTS) {
    await prisma.project.create({
      data: {
        id: p.id,
        ownerId: p.ownerId,
        title: p.title,
        pitch: p.pitch,
        // Mock shape is string[] (paragraphs); real schema column is a single Text field —
        // see prisma/schema.prisma's Project doc comment for the "\n\n" join/split convention.
        description: p.description.join('\n\n'),
        stage: p.stage,
        commitmentLevel: p.commitmentLevel,
        collaborationStyle: p.collaborationStyle,
        tools: p.tools,
        isOpenToCollabs: p.isOpenToCollabs,
        isPublic: p.isPublic,
        viewingCount: p.viewingCount ?? 0,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        skills: { create: p.skills.map((s) => ({ skillId: s.id })) },
        domains: { create: p.domains.map((d) => ({ domainId: d.id })) },
        roles: {
          create: p.roles.map((r, i) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            order: i,
          })),
        },
        links: { create: p.links.map((l) => ({ id: l.id, label: l.label, url: l.url })) },
        updates: {
          create: p.updates.map((u) => ({
            id: u.id,
            content: u.content,
            createdAt: new Date(u.createdAt),
          })),
        },
      },
    });
  }

  console.log(`Seeded ${SKILLS.length} skills, ${DOMAINS.length} domains, ${USERS.length} users, ${PROJECTS.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
