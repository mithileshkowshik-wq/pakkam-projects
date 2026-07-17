import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import type { Project } from '@/lib/mock/types';
import { Card, Chip, H2, H3, StatusBadge, Sub } from '@/components/ui';

import { OwnerInlineLink } from './OwnerInlineLink';

export interface ProjectCardProps {
  project: Pick<
    Project,
    'id' | 'title' | 'pitch' | 'stage' | 'domains' | 'skills' | 'commitmentLevel' | 'owner'
  >;
  /** Accent Card styling — used for the first/featured feed card. */
  highlighted?: boolean;
  /**
   * Intentional extension beyond the handoff interface: 220px fixed-width variant for Profile's
   * horizontal-scroll row — category chip + title + status only (no pitch, skills, or footer).
   */
  compact?: boolean;
}

const MAX_SKILLS = 4;

/** Rounded emoji tile — the card's visual anchor in a data model with no cover images. */
function DomainTile({ emoji, size = 'md' }: { emoji?: string; size?: 'sm' | 'md' }) {
  return (
    <span
      aria-hidden
      className={
        size === 'sm'
          ? 'flex h-9 w-9 flex-none items-center justify-center rounded-[11px] bg-gradient-to-br from-tag-bg to-bg text-[17px] ring-1 ring-inset ring-primary/10'
          : 'flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-gradient-to-br from-tag-bg to-bg text-[21px] ring-1 ring-inset ring-primary/10 transition-transform duration-200 ease-out-soft group-hover:scale-105'
      }
    >
      {emoji ?? '✦'}
    </span>
  );
}

export function ProjectCard({ project, highlighted, compact }: ProjectCardProps) {
  const domain = project.domains[0];

  if (compact) {
    return (
      <Link href={`/projects/${project.id}`} className="group block w-[220px] flex-none snap-start">
        <Card className="flex h-full flex-col gap-3 transition-all duration-200 ease-out-soft group-hover:-translate-y-0.5 group-hover:border-accent-border group-hover:shadow-card-hover">
          <div className="flex items-center gap-2.5">
            <DomainTile emoji={domain?.emoji} size="sm" />
            {domain && (
              <span className="truncate font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-tag-text">
                {domain.name}
              </span>
            )}
          </div>
          <H3 className="transition-colors duration-200 group-hover:text-primary-hover">
            {project.title}
          </H3>
          <StatusBadge stage={project.stage} className="mt-auto self-start" />
        </Card>
      </Link>
    );
  }

  const overflow = project.skills.length - MAX_SKILLS;

  // Stretched-link pattern: the card is NOT itself an <a> (that nested OwnerInlineLink's <a>
  // inside it — invalid HTML that caused a real hydration error). The title's Link carries an
  // ::after overlay covering the whole card; OwnerInlineLink stacks above it with z-10.
  return (
    <div className="group relative">
      <Card
        accent={highlighted}
        className="flex flex-col gap-3 transition-all duration-200 ease-out-soft group-hover:-translate-y-0.5 group-hover:border-accent-border group-hover:shadow-card-hover"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <DomainTile emoji={domain?.emoji} />
            <div className="min-w-0">
              {domain && (
                <p className="truncate font-mono text-fine font-medium uppercase tracking-[0.08em] text-tag-text">
                  {domain.name}
                </p>
              )}
              <H2 className="mt-0.5 line-clamp-2 transition-colors duration-200 group-hover:text-primary-hover">
                <Link
                  href={`/projects/${project.id}`}
                  className="after:absolute after:inset-0 after:z-0 after:rounded-lg"
                >
                  {project.title}
                </Link>
              </H2>
            </div>
          </div>
          <StatusBadge stage={project.stage} className="flex-none" />
        </div>

        <Sub className="line-clamp-2">{project.pitch}</Sub>

        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, MAX_SKILLS).map((skill) => (
            <Chip key={skill.id} variant="tag" size="sm">
              {skill.name}
            </Chip>
          ))}
          {overflow > 0 && (
            <Chip variant="mut" size="sm">
              +{overflow}
            </Chip>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-border-light pt-[14px]">
          <OwnerInlineLink owner={project.owner} commitmentLevel={project.commitmentLevel} />
          {/* Visual affordance only — the stretched title link already covers this area. */}
          <span className="inline-flex flex-none items-center gap-1.5 text-note font-semibold text-text-secondary transition-colors duration-200 group-hover:text-primary">
            View project
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </div>
      </Card>
    </div>
  );
}
