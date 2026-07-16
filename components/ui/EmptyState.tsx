import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './Button';

export interface EmptyStateProps {
  icon: ReactNode;
  heading: string;
  subtext: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon, heading, subtext, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        // dashed border colour #E0CFD2 has no token — border (#E7D9DC) is the nearest
        'flex flex-col items-center gap-[9px] rounded-md border border-dashed border-border bg-surface p-[34px] text-center',
        className,
      )}
    >
      <span
        aria-hidden
        className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-tag-bg text-primary"
      >
        {icon}
      </span>
      <p className="text-[15px] font-semibold text-text-secondary">{heading}</p>
      <p className="text-[13px] text-text-secondary">{subtext}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
