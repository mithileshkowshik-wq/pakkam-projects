'use server';

import { getCurrentUser } from '@/lib/data';
import { prisma } from '@/lib/data/prisma';
import { createProjectSchema, type CreateProjectInput } from '@/lib/validations/project';

export interface CreateProjectResult {
  ok: boolean;
  projectId?: string;
  error?: string;
}

export async function createProject(input: CreateProjectInput): Promise<CreateProjectResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { ok: false, error: 'You need to be signed in to publish a project.' };

  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' };
  }
  const data = parsed.data;

  const links = [
    data.demoLink ? { label: 'Demo', url: data.demoLink } : null,
    data.githubLink ? { label: 'GitHub', url: data.githubLink } : null,
  ].filter((l): l is { label: string; url: string } => l !== null);

  try {
    const project = await prisma.project.create({
      data: {
        ownerId: currentUser.id,
        title: data.title,
        pitch: data.pitch,
        // Single Text column — see prisma/schema.prisma's Project doc comment. The form's
        // description field is already one string, so no paragraph-join is needed here.
        description: data.description,
        stage: data.stage,
        commitmentLevel: data.commitment,
        collaborationStyle: data.collaborationStyle,
        tools: data.tools,
        isOpenToCollabs: data.openToCollaborators,
        isPublic: data.whoCanApply === 'ANYONE',
        domains: { create: [{ domainId: data.categoryDomainId }] },
        skills: { create: data.skillsNeeded.map((skillId) => ({ skillId })) },
        roles: {
          create: data.roles.map((r, i) => ({ title: r.title, description: r.description, order: i })),
        },
        links: { create: links },
      },
      select: { id: true },
    });
    return { ok: true, projectId: project.id };
  } catch {
    return { ok: false, error: 'Something went wrong publishing your project. Please try again.' };
  }
}
