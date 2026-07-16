'use client';

import { Plus, X } from 'lucide-react';

import { Button, Chip, Input, RadioCard, TagPicker } from '@/components/ui';
import { SKILLS } from '@/lib/mock';
import type { CommitmentLevel } from '@/lib/mock/types';

import { MAX_ROLES, MAX_SKILLS, type RoleDraft } from '@/hooks/usePostProjectForm';

const COMMITMENTS: { value: CommitmentLevel; label: string }[] = [
  { value: 'CASUAL', label: 'Casual' },
  { value: 'PART_TIME', label: 'Part-time — 5–10 hrs/week' },
  { value: 'SERIOUS', label: 'Serious — 10+ hrs/week' },
];

const COLLABORATION_STYLES = ['Remote', 'In-person', 'Async', 'Scheduled calls', 'Flexible'];

const skillOptions = SKILLS.map((s) => ({ id: s.id, name: s.name }));

export interface LookingForSectionProps {
  roles: RoleDraft[];
  skillsNeeded: string[];
  commitment: CommitmentLevel;
  collaborationStyle: string[];
  addRole: () => void;
  removeRole: (id: string) => void;
  updateRole: (id: string, patch: Partial<Omit<RoleDraft, 'id'>>) => void;
  setSkillsNeeded: (v: string[]) => void;
  setCommitment: (v: CommitmentLevel) => void;
  toggleCollaborationStyle: (v: string) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-sm font-semibold text-ink">{children}</p>;
}

export function LookingForSection({
  roles,
  skillsNeeded,
  commitment,
  collaborationStyle,
  addRole,
  removeRole,
  updateRole,
  setSkillsNeeded,
  setCommitment,
  toggleCollaborationStyle,
}: LookingForSectionProps) {
  const atRoleMax = roles.length >= MAX_ROLES;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <FieldLabel>Roles you&apos;re looking for</FieldLabel>
        <div className="flex flex-col gap-2.5">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center gap-2">
              <Input
                className="flex-1"
                value={role.title}
                onChange={(e) => updateRole(role.id, { title: e.target.value })}
                placeholder="Role, e.g. Backend dev"
              />
              <Input
                className="flex-[1.4]"
                value={role.description}
                onChange={(e) => updateRole(role.id, { description: e.target.value })}
                placeholder="What they'll do"
              />
              <Button
                variant="ghost"
                aria-label={`Remove role ${role.title || ''}`.trim()}
                className="flex-none border-transparent px-2 text-text-meta hover:text-ink"
                onClick={() => removeRole(role.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {!atRoleMax && (
            <Button
              variant="ghost"
              className="self-start border-accent-border text-primary"
              onClick={addRole}
            >
              <Plus className="h-4 w-4" />
              Add another role
            </Button>
          )}
        </div>
      </div>

      <TagPicker
        options={skillOptions}
        selected={skillsNeeded}
        onChange={setSkillsNeeded}
        max={MAX_SKILLS}
        label="Skills needed"
        placeholder="Type to add a skill…"
      />

      <div>
        <FieldLabel>Commitment level</FieldLabel>
        <div role="radiogroup" aria-label="Commitment level" className="flex flex-col gap-2.5">
          {COMMITMENTS.map((c) => (
            <RadioCard
              key={c.value}
              label={c.label}
              selected={commitment === c.value}
              onSelect={() => setCommitment(c.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Collaboration style</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {COLLABORATION_STYLES.map((style) => {
            const selected = collaborationStyle.includes(style);
            return (
              <Chip
                key={style}
                variant={selected ? 'fill' : 'default'}
                selected={selected}
                onClick={() => toggleCollaborationStyle(style)}
              >
                {style}
              </Chip>
            );
          })}
        </div>
      </div>
    </div>
  );
}
