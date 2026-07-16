'use client';

import { useState } from 'react';

import type { ProjectUpdate } from '@/lib/mock/types';
import { MonoLabel, Sub } from '@/components/ui';

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

  return (
    <div className="flex flex-col gap-3">
      {visible.map((update) => (
        <div key={update.id} className="rounded-md border border-border bg-surface p-4">
          <MonoLabel>{formatDate(update.createdAt)}</MonoLabel>
          <Sub className="mt-1 text-[13.5px]">{update.content}</Sub>
        </div>
      ))}
      {canCollapse && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="self-start text-[13.5px] font-semibold text-primary hover:text-primary-hover"
        >
          Show more →
        </button>
      )}
    </div>
  );
}
