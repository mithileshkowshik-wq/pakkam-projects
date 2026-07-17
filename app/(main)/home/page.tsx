import { ProjectFeedFilters } from '@/components/project/ProjectFeedFilters';
import { SuggestedRail } from '@/components/shared/SuggestedRail';
import { H1, MonoLabel } from '@/components/ui';
import { getCurrentUser, getDomains, getFeedProjects, getSuggestedPeople, getSuggestedProjects } from '@/lib/data';

export default async function HomePage() {
  const currentUser = await getCurrentUser();
  const [projects, domains, suggestedPeople, suggestedProjects] = await Promise.all([
    getFeedProjects(),
    getDomains(),
    getSuggestedPeople(currentUser!, 3),
    getSuggestedProjects(currentUser!, 2),
  ]);

  return (
    <div>
      <div className="duration-500 ease-out-soft animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="h-px w-7 bg-gradient-to-r from-primary to-primary/0" />
          <MonoLabel className="text-primary">Discover</MonoLabel>
        </div>
        <H1 className="mt-2">Find your next collaboration</H1>
      </div>

      {/* <desktop stacks (rail toggle above feed via order); ≥desktop is the two-track feed + rail row. */}
      <div className="flex flex-col gap-2 desktop:flex-row desktop:items-start desktop:gap-6">
        <ProjectFeedFilters projects={projects} domains={domains} />
        <SuggestedRail people={suggestedPeople} projects={suggestedProjects} />
      </div>
    </div>
  );
}
