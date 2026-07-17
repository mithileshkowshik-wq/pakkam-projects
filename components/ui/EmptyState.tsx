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
        'flex flex-col items-center gap-[9px] rounded-lg border border-dashed border-accent-border/70 bg-surface/70 p-[34px] text-center duration-300 ease-out-soft animate-in fade-in slide-in-from-bottom-2',
        className,
      )}
    >
      <span
        aria-hidden
        className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gradient-to-br from-tag-bg to-accent-border/60 text-primary shadow-[inset_0_0_0_1px_rgba(239,98,108,.12)]"
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
