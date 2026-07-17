import Link from 'next/link';

import type { Project } from '@/lib/mock/types';
import { Card, Chip, H3, Meta, SectionDivider } from '@/components/ui';

export interface SuggestedProjectsCardProps {
  projects: Pick<Project, 'id' | 'title' | 'skills'>[];
}

export function SuggestedProjectsCard({ projects }: SuggestedProjectsCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-teal" />
        <H3>Suggested projects</H3>
      </div>

      {projects.length === 0 ? (
        <Meta className="mt-4 text-text-secondary">
          No matches yet — projects posted with skills like yours will show up here.
        </Meta>
      ) : (
        <>
          <div className="mt-4 flex flex-col">
            {projects.map((project, i) => (
              <div key={project.id}>
                {i > 0 && <SectionDivider tight className="my-3" />}
                <Link
                  href={`/projects/${project.id}`}
                  className="group -mx-2 block rounded-[12px] px-2 py-1.5 transition-colors duration-200 hover:bg-bg/70"
                >
                  <p className="text-[14px] font-semibold text-ink transition-colors duration-200 group-hover:text-primary-hover">
                    {project.title}
                  </p>
                  {project.skills.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {project.skills.slice(0, 2).map((skill) => (
                        <Chip key={skill.id} variant="tag" size="sm">
                          {skill.name}
                        </Chip>
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* "See all" collapses back to the main discovery feed, which is a real route. */}
          <Link
            href="/home"
            className="mt-4 inline-block text-note font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            See all matches →
          </Link>
        </>
      )}
    </Card>
  );
}
