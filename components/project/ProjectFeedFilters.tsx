'use client';

import { ChevronDown, Rocket, SearchX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { ProjectCard } from '@/components/project/ProjectCard';
import { Chip, EmptyState } from '@/components/ui';
import type { CommitmentLevel, Domain, Project, ProjectStage } from '@/lib/mock/types';
import { cn } from '@/lib/utils';

const ALL = 'All';

const STAGE_OPTIONS: { value: ProjectStage; label: string }[] = [
  { value: 'IDEA', label: 'Just an Idea' },
  { value: 'PROTOTYPE', label: 'Early Prototype' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'NEAR_LAUNCH', label: 'Nearing Launch' },
];

const COMMITMENT_OPTIONS: { value: CommitmentLevel; label: string }[] = [
  { value: 'CASUAL', label: 'Casual' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'SERIOUS', label: 'Serious' },
];

export interface ProjectFeedFiltersProps {
  projects: Project[];
  domains: Domain[];
}

/**
 * Single cohesive client island: owns the domain/stage/commitment/skill filter state and renders
 * BOTH the filter chip row and the filtered ProjectCard list. Keeping list + controls in one
 * component avoids syncing filter state across a server/client boundary. Filtering is synchronous
 * in-memory array work, so no debounce is needed.
 */
export function ProjectFeedFilters({ projects, domains }: ProjectFeedFiltersProps) {
  const router = useRouter();
  const [activeDomain, setActiveDomain] = useState<string>(ALL);
  const [activeStage, setActiveStage] = useState<ProjectStage | typeof ALL>(ALL);
  const [activeCommitment, setActiveCommitment] = useState<CommitmentLevel | typeof ALL>(ALL);
  const [activeSkill, setActiveSkill] = useState<string>(ALL);

  // Domains that actually appear in the feed, deduped by name, ordered to match `domains`.
  const feedDomains = useMemo(() => {
    const present = new Set(projects.flatMap((p) => p.domains.map((d) => d.name)));
    return domains.filter((d) => present.has(d.name));
  }, [projects, domains]);

  const skillNames = useMemo(() => {
    const names = new Set(projects.flatMap((p) => p.skills.map((s) => s.name)));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const noFiltersActive =
    activeDomain === ALL &&
    activeStage === ALL &&
    activeCommitment === ALL &&
    activeSkill === ALL;

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (activeDomain !== ALL && !p.domains.some((d) => d.name === activeDomain)) return false;
        if (activeStage !== ALL && p.stage !== activeStage) return false;
        if (activeCommitment !== ALL && p.commitmentLevel !== activeCommitment) return false;
        if (activeSkill !== ALL && !p.skills.some((s) => s.name === activeSkill)) return false;
        return true;
      }),
    [projects, activeDomain, activeStage, activeCommitment, activeSkill],
  );

  const clearFilters = () => {
    setActiveDomain(ALL);
    setActiveStage(ALL);
    setActiveCommitment(ALL);
    setActiveSkill(ALL);
  };

  return (
    <div className="min-w-0 flex-1">
      <div className="my-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Chip
            variant={activeDomain === ALL ? 'fill' : 'default'}
            selected={activeDomain === ALL}
            onClick={() => setActiveDomain(ALL)}
          >
            All
          </Chip>
          {feedDomains.map((d) => (
            <Chip
              key={d.id}
              variant={activeDomain === d.name ? 'fill' : 'default'}
              selected={activeDomain === d.name}
              onClick={() => setActiveDomain(d.name)}
            >
              {d.emoji ? `${d.emoji} ` : ''}
              {d.name}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="Stage"
            value={activeStage}
            onChange={(v) => setActiveStage(v as ProjectStage | typeof ALL)}
            options={STAGE_OPTIONS}
          />
          <FilterSelect
            label="Commitment"
            value={activeCommitment}
            onChange={(v) => setActiveCommitment(v as CommitmentLevel | typeof ALL)}
            options={COMMITMENT_OPTIONS}
          />
          <FilterSelect
            label="Skills"
            value={activeSkill}
            onChange={setActiveSkill}
            options={skillNames.map((name) => ({ value: name, label: name }))}
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} highlighted={i === 0 && noFiltersActive} />
          ))}
        </div>
      ) : noFiltersActive && projects.length === 0 ? (
        // Distinct from the "no filtered results" case below: the platform genuinely has zero
        // projects yet, so "clear filters" (which the user never touched) would be misleading.
        <EmptyState
          icon={<Rocket className="h-5 w-5" aria-hidden />}
          heading="No projects yet"
          subtext="Be the first to post one and find collaborators."
          action={{ label: 'Post a Project', onClick: () => router.push('/projects/new') }}
        />
      ) : (
        <EmptyState
          icon={<SearchX className="h-5 w-5" aria-hidden />}
          heading="No projects match"
          subtext="Try clearing a filter or two to see more collaborations."
          action={{ label: 'Clear filters', onClick: clearFilters }}
        />
      )}
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

// Native <select> styled to read as a `mut` Chip — accessible and far less code than a custom
// popover, while still being a real, functional filter control.
function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  const active = value !== ALL;
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'cursor-pointer appearance-none rounded-pill border bg-bg py-[7px] pl-[14px] pr-9 text-[13px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          active ? 'border-primary text-ink' : 'border-border text-text-secondary',
        )}
      >
        <option value={ALL}>{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-meta"
        aria-hidden
      />
    </div>
  );
}
