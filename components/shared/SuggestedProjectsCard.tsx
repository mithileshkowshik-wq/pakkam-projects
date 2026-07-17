import Link from 'next/link';

import type { Project } from '@/lib/mock/types';
import { Card, Chip, H3, Meta, SectionDivider } from '@/components/ui';

export interface SuggestedProjectsCardProps {
  projects: Pick<Project, 'id' | 'title' | 'skills'>[];
}

export function SuggestedProjectsCard({ projects }: SuggestedProjectsCardProps) {
  return (
    <Card>
      <H3>Suggested projects</H3>

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
                <Link href={`/projects/${project.id}`} className="block">
                  <p className="text-[14px] font-semibold text-ink">{project.title}</p>
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
          <Link href="/home" className="mt-4 inline-block text-[13.5px] font-semibold text-primary">
            See all matches →
          </Link>
        </>
      )}
    </Card>
  );
}
