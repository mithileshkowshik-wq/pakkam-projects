'use client';

import { CharCounter, Chip, Input, RadioCard } from '@/components/ui';
import type { Domain, ProjectStage } from '@/lib/data';

import { PITCH_MAX, TITLE_MAX } from '@/hooks/usePostProjectForm';

const STAGES: { value: ProjectStage; label: string }[] = [
  { value: 'IDEA', label: '💡 Just an idea' },
  { value: 'PROTOTYPE', label: '🎨 Early prototype' },
  { value: 'IN_PROGRESS', label: '🚀 In progress' },
  { value: 'NEAR_LAUNCH', label: '🎯 Nearing launch' },
];

export interface BasicsSectionProps {
  title: string;
  pitch: string;
  categoryDomainId: string;
  stage: ProjectStage;
  domains: Domain[];
  setTitle: (v: string) => void;
  setPitch: (v: string) => void;
  setCategory: (v: string) => void;
  setStage: (v: ProjectStage) => void;
}

function Field({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-ink">{label}</label>
      </div>
      {children}
    </div>
  );
}

export function BasicsSection({
  title,
  pitch,
  categoryDomainId,
  stage,
  domains,
  setTitle,
  setPitch,
  setCategory,
  setStage,
}: BasicsSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="project-title" className="text-sm font-semibold text-ink">
            Project name
          </label>
          <CharCounter count={title.length} max={TITLE_MAX} />
        </div>
        <Input
          id="project-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you building?"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="project-pitch" className="text-sm font-semibold text-ink">
            One-line pitch
          </label>
          <CharCounter count={pitch.length} max={PITCH_MAX} />
        </div>
        <Input
          id="project-pitch"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          placeholder="Sum it up in a sentence"
        />
      </div>

      <Field label="Category">
        <div className="flex flex-wrap gap-2">
          {domains.map((domain) => {
            const selected = categoryDomainId === domain.id;
            return (
              <Chip
                key={domain.id}
                variant={selected ? 'fill' : 'default'}
                selected={selected}
                onClick={() => setCategory(selected ? '' : domain.id)}
              >
                {domain.emoji ? `${domain.emoji} ${domain.name}` : domain.name}
              </Chip>
            );
          })}
        </div>
      </Field>

      <Field label="Stage">
        <div role="radiogroup" aria-label="Stage" className="grid grid-cols-2 gap-2.5">
          {STAGES.map((s) => (
            <RadioCard
              key={s.value}
              label={s.label}
              selected={stage === s.value}
              onSelect={() => setStage(s.value)}
            />
          ))}
        </div>
      </Field>
    </div>
  );
}
