import { Search } from 'lucide-react';

import { ProjectFeedFilters } from '@/components/project/ProjectFeedFilters';
import { SuggestedRail } from '@/components/shared/SuggestedRail';
import { H1, Input, MonoLabel } from '@/components/ui';
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <MonoLabel>Discover</MonoLabel>
          <H1 className="mt-1">Find your next collaboration</H1>
        </div>

        {/* Decorative only: there is no backend search index yet, so this input is a real,
            focusable field but is intentionally not wired to filter the feed. */}
        <div className="relative w-[300px] max-w-full">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-meta"
            aria-hidden
          />
          <Input className="pl-10" placeholder="Search projects, skills, people…" aria-label="Search" />
        </div>
      </div>

      {/* <desktop stacks (rail toggle above feed via order); ≥desktop is the two-track feed + rail row. */}
      <div className="flex flex-col gap-2 desktop:flex-row desktop:items-start desktop:gap-6">
        <ProjectFeedFilters projects={projects} domains={domains} />
        <SuggestedRail people={suggestedPeople} projects={suggestedProjects} />
      </div>
    </div>
  );
}
