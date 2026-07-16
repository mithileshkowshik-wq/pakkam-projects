import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface CardProps {
  accent?: boolean;
  className?: string;
  children: ReactNode;
}

export function Card({ accent, className, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-surface p-5',
        accent
          ? 'border border-accent-border shadow-accent'
          : 'border border-border shadow-card',
        className,
      )}
    >
      {children}
    </div>
  );
}
