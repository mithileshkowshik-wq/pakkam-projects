import { getDomains, getSkills } from '@/lib/data';

import { OnboardingForm } from './OnboardingForm';

export default async function OnboardingPage() {
  const [skills, domains] = await Promise.all([getSkills(), getDomains()]);

  return <OnboardingForm skills={skills} domains={domains} />;
}
