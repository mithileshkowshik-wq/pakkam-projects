import { notFound } from 'next/navigation';

import { getCurrentUser, getProjectsByOwner, getUserByUsername } from '@/lib/data';
import { SectionDivider } from '@/components/ui';
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard';
import { ActiveProjectsRow } from '@/components/profile/ActiveProjectsRow';

interface ProfilePageProps {
  params: { username: string };
}

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
    </div>
  );
}
