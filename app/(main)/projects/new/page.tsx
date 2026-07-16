import { getDomains, getSkills } from '@/lib/data';
import { PostProjectForm } from '@/components/project/post-form/PostProjectForm';

export default async function Page() {
  const [domains, skills] = await Promise.all([getDomains(), getSkills()]);
  return <PostProjectForm domains={domains} skills={skills} />;
}
