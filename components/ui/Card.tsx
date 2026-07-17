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
        'rounded-lg p-5',
        accent
          ? 'border border-accent-border bg-card-sheen shadow-accent'
          : 'border border-border/80 bg-surface shadow-card',
        className,
      )}
    >
      {children}
    </div>
  );
}
