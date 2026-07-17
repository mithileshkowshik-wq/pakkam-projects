import { redirect } from 'next/navigation';

import { getCurrentUser, getDomains, getSkills } from '@/lib/data';
import { EditProfileForm } from '@/components/profile/EditProfileForm';

export default async function EditProfilePage() {
  const [user, skills, domains] = await Promise.all([getCurrentUser(), getSkills(), getDomains()]);
  if (!user) redirect('/login');

  return (
    <div className="mx-auto max-w-xl">
      <EditProfileForm user={user} skills={skills} domains={domains} />
    </div>
  );
}
