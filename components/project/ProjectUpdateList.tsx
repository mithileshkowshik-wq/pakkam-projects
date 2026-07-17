'use client';

import { Megaphone } from 'lucide-react';
import { useState } from 'react';

import type { ProjectUpdate } from '@/lib/mock/types';
import { EmptyState, MonoLabel, Sub } from '@/components/ui';

export interface ProjectUpdateListProps {
  updates: ProjectUpdate[];
}

const INITIAL_VISIBLE = 2;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ProjectUpdateList({ updates }: ProjectUpdateListProps) {
  const [expanded, setExpanded] = useState(false);
  const canCollapse = updates.length > INITIAL_VISIBLE;
  const visible = expanded || !canCollapse ? updates : updates.slice(0, INITIAL_VISIBLE);

  if (updates.length === 0) {
    return (
      <EmptyState
        icon={<Megaphone className="h-5 w-5" aria-hidden />}
        heading="No updates yet"
        subtext="The owner hasn't posted an update on this project yet."
      />
    );
  }

  return (
    // Timeline treatment: a hairline rail with coral dots instead of a stack of boxed cards.
    <div className="relative flex flex-col gap-5 pl-6 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-border">
      {visible.map((update) => (
        <div key={update.id} className="relative">
          <span
            aria-hidden
            className="absolute -left-6 top-[3px] h-[11px] w-[11px] rounded-full bg-brand-gradient shadow-chip-primary ring-[3px] ring-bg"
          />
          <MonoLabel>{formatDate(update.createdAt)}</MonoLabel>
          <Sub className="mt-1 text-note">{update.content}</Sub>
        </div>
      ))}
      {canCollapse && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="self-start text-note font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Show more →
        </button>
      )}
    </div>
  );
}
