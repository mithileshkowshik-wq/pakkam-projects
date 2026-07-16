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
        <div className="flex gap-4 overflow-x-auto mt-4 pb-1">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} compact />
          ))}
        </div>
      )}
    </section>
  );
}
