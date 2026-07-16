import Link from 'next/link';

import { COMMITMENT_LABEL } from '@/lib/constants';
import type { Project } from '@/lib/mock/types';
import { Avatar, Card, Chip, H2, H3, StatusBadge, Sub } from '@/components/ui';

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

export function ProjectCard({ project, highlighted, compact }: ProjectCardProps) {
  const domain = project.domains[0];
  const category = domain && (
    <Chip variant="tag" size="sm">
      {domain.emoji ? `${domain.emoji} ` : ''}
      {domain.name}
    </Chip>
  );

  if (compact) {
    return (
      <Link href={`/projects/${project.id}`} className="block w-[220px] flex-none">
        <Card className="flex h-full flex-col gap-2.5">
          {category}
          <H3>{project.title}</H3>
          <StatusBadge stage={project.stage} className="self-start" />
        </Card>
      </Link>
    );
  }

  const overflow = project.skills.length - MAX_SKILLS;

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card accent={highlighted} className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          {category}
          <StatusBadge stage={project.stage} />
        </div>

        <H2>{project.title}</H2>
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

        <div className="mt-[14px] flex items-center justify-between gap-3 border-t border-border-light pt-[14px]">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar size={32} name={project.owner.name} src={project.owner.avatarUrl} />
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-semibold text-ink">{project.owner.name}</p>
              <p className="truncate text-[13px] text-text-secondary">
                {COMMITMENT_LABEL[project.commitmentLevel]}
              </p>
            </div>
          </div>
          {/* Visual affordance only: the whole Card is already a Link, so a real Button here would
              nest an interactive <button> inside an <a>. Styled as a ghost button instead. */}
          <span className="inline-flex flex-none items-center gap-2 rounded-sm border border-border px-[18px] py-2.5 text-sm font-semibold text-ink">
            View Project →
          </span>
        </div>
      </Card>
    </Link>
  );
}
