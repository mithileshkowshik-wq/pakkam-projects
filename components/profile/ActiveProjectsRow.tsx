import { FolderOpen } from 'lucide-react';

import type { Project } from '@/lib/mock/types';
import { EmptyState, H2 } from '@/components/ui';
import { ProjectCard } from '@/components/project/ProjectCard';

export interface ActiveProjectsRowProps {
  projects: Project[];
}

export function ActiveProjectsRow({ projects }: ActiveProjectsRowProps) {
  return (
    <section>
      {/* No "see all my projects" screen exists this pass, so the affordance is omitted rather
          than linked nowhere. */}
      <H2>Active projects</H2>

      {projects.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<FolderOpen className="h-5 w-5" aria-hidden />}
            heading="No active projects yet"
            subtext="Projects they start or join will show up here."
          />
        </div>
      ) : (
        <div className="-mx-1 mt-4 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} compact />
          ))}
        </div>
      )}
    </section>
  );
}
