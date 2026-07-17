import { notFound } from 'next/navigation';

import { getCurrentUser, getProjectsByOwner, getUserByUsername } from '@/lib/data';
import { H2, SectionDivider, Sub } from '@/components/ui';
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard';
import { ActiveProjectsRow } from '@/components/profile/ActiveProjectsRow';
import {
  PastCollaborationsGrid,
  mockPastCollaborations,
} from '@/components/profile/PastCollaborationsGrid';
import { SkillsEndorsementsEmptyState } from '@/components/profile/SkillsEndorsementsEmptyState';

interface ProfilePageProps {
  params: { username: string };
}

// CONTENT GAP: an "open to working on" free-text field is not in the shared User mock schema
// (frozen). Static placeholder kept local to this page — orchestrator can replace when modeled.
const OPEN_TO_WORKING_ON =
  'Small, weird, cozy games and playful prototypes — especially anything with an unusual mechanic or a strong sense of place. Happy to pair with an artist or musician to explore an idea over a few weekends.';

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await getUserByUsername(params.username);
  if (!user) notFound();

  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === user.id;
  const activeProjects = await getProjectsByOwner(user.id);

  return (
    <div className="mx-auto max-w-[680px] duration-500 ease-out-soft animate-in fade-in slide-in-from-bottom-2">
      <ProfileHeaderCard user={user} isOwner={isOwner} />

      <SectionDivider />
      <ActiveProjectsRow projects={activeProjects} />

      <SectionDivider />
      <section>
        <H2>Open to working on</H2>
        <Sub className="mt-2">{OPEN_TO_WORKING_ON}</Sub>
      </section>

      <SectionDivider />
      <section>
        <H2>Past collaborations</H2>
        <PastCollaborationsGrid collaborations={mockPastCollaborations} />
      </section>

      <SectionDivider />
      <section>
        <H2 className="text-text-meta">Skills endorsements</H2>
        <div className="mt-4">
          <SkillsEndorsementsEmptyState />
        </div>
      </section>
    </div>
  );
}
