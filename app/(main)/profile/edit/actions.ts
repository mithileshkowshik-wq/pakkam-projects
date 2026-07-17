'use server';

import { redirect } from 'next/navigation';

import { getCurrentUser, getDomains, getSkills } from '@/lib/data';
import { prisma } from '@/lib/data/prisma';
import { profileEditSchema, type ProfileEditInput } from '@/lib/validations/profile';

export interface SaveProfileResult {
  ok: boolean;
  error?: string;
}

export async function saveProfile(input: ProfileEditInput): Promise<SaveProfileResult> {
  // Re-derive the user from the session server-side — never trust a client-passed id.
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const parsed = profileEditSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' };
  }
  const data = parsed.data;

  // Basic sanity: only keep skill/domain ids that actually exist, deduped.
  const [skills, domains] = await Promise.all([getSkills(), getDomains()]);
  const validSkillIds = new Set(skills.map((s) => s.id));
  const validDomainIds = new Set(domains.map((d) => d.id));
  const skillIds = Array.from(new Set(data.skillIds)).filter((id) => validSkillIds.has(id));
  const domainIds = Array.from(new Set(data.domainIds)).filter((id) => validDomainIds.has(id));

  // Same full-replace transaction shape as onboarding's saveOnboarding, but this action must
  // NOT touch profileComplete (already true by the time a user can reach this screen) and DOES
  // persist headline (onboarding never collects it).
  await prisma.$transaction([
    prisma.userSkill.deleteMany({ where: { userId: user.id } }),
    prisma.userDomain.deleteMany({ where: { userId: user.id } }),
    prisma.userSkill.createMany({ data: skillIds.map((skillId) => ({ userId: user.id, skillId })) }),
    prisma.userDomain.createMany({ data: domainIds.map((domainId) => ({ userId: user.id, domainId })) }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        headline: data.headline || null,
        bio: data.bio || null,
        location: data.location || null,
        availabilityLevel: data.availabilityLevel,
      },
    }),
  ]);

  redirect(`/profile/${user.username}`);
}
