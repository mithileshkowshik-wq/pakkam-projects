'use server';

import { redirect } from 'next/navigation';

import { getCurrentUser, getDomains, getSkills } from '@/lib/data';
import type { Availability } from '@/lib/data';
import { prisma } from '@/lib/data/prisma';

export interface OnboardingInput {
  bio: string;
  availabilityLevel: Availability;
  location: string;
  skillIds: string[];
  domainIds: string[];
}

const AVAILABILITY_VALUES: Availability[] = ['CASUAL', 'PART_TIME', 'SERIOUS', 'BROWSING'];
const BIO_MAX = 100;
const MAX_SKILLS = 15;
const MAX_DOMAINS = 8;

export async function saveOnboarding(input: OnboardingInput) {
  // Re-derive the user from the session server-side — never trust a client-passed id.
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  // Basic sanity: only keep skill/domain ids that actually exist, deduped and capped.
  const [skills, domains] = await Promise.all([getSkills(), getDomains()]);
  const validSkillIds = new Set(skills.map((s) => s.id));
  const validDomainIds = new Set(domains.map((d) => d.id));
  const skillIds = Array.from(new Set(input.skillIds))
    .filter((id) => validSkillIds.has(id))
    .slice(0, MAX_SKILLS);
  const domainIds = Array.from(new Set(input.domainIds))
    .filter((id) => validDomainIds.has(id))
    .slice(0, MAX_DOMAINS);

  const availabilityLevel = AVAILABILITY_VALUES.includes(input.availabilityLevel)
    ? input.availabilityLevel
    : 'CASUAL';
  const bio = input.bio.trim().slice(0, BIO_MAX) || null;
  const location = input.location.trim() || null;

  // Onboarding always replaces the full skill/domain selection (there's no partial-update
  // semantic here), so wipe the existing join rows and recreate them. All of it plus the
  // profileComplete flag runs in one transaction so a user is never left half-updated.
  await prisma.$transaction([
    prisma.userSkill.deleteMany({ where: { userId: user.id } }),
    prisma.userDomain.deleteMany({ where: { userId: user.id } }),
    prisma.userSkill.createMany({ data: skillIds.map((skillId) => ({ userId: user.id, skillId })) }),
    prisma.userDomain.createMany({ data: domainIds.map((domainId) => ({ userId: user.id, domainId })) }),
    prisma.user.update({
      where: { id: user.id },
      data: { profileComplete: true, bio, availabilityLevel, location },
    }),
  ]);

  redirect('/home');
}
