'use client';

import { Meta, RadioCard, Toggle } from '@/components/ui';

import type { WhoCanApply } from '@/hooks/usePostProjectForm';

const APPLY_OPTIONS: { value: WhoCanApply; label: string }[] = [
  { value: 'ANYONE', label: 'Anyone' },
  { value: 'INVITE_ONLY', label: 'People I invite only' },
];

export interface VisibilitySectionProps {
  openToCollaborators: boolean;
  whoCanApply: WhoCanApply;
  setOpenToCollaborators: (v: boolean) => void;
  setWhoCanApply: (v: WhoCanApply) => void;
}

export function VisibilitySection({
  openToCollaborators,
  whoCanApply,
  setOpenToCollaborators,
  setWhoCanApply,
}: VisibilitySectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">Open to new collaborators</p>
          <Meta className="text-text-meta">
            Show a &quot;looking for collaborators&quot; badge on your project.
          </Meta>
        </div>
        <Toggle
          checked={openToCollaborators}
          onChange={setOpenToCollaborators}
          label="Open to new collaborators"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Who can apply?</p>
        <div role="radiogroup" aria-label="Who can apply" className="flex flex-col gap-2.5">
          {APPLY_OPTIONS.map((o) => (
            <RadioCard
              key={o.value}
              label={o.label}
              selected={whoCanApply === o.value}
              onSelect={() => setWhoCanApply(o.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
