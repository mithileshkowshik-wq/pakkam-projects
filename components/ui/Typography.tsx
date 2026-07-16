import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        'font-display text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink',
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        'font-display text-[19px] font-bold leading-[1.2] tracking-[-0.01em] text-ink',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn('font-sans text-[15px] font-semibold text-ink', className)}>
      {children}
    </h3>
  );
}

export function Sub({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-[14.5px] leading-[1.55] text-text-secondary', className)}>
      {children}
    </p>
  );
}

export function Meta({ children, className }: TypographyProps) {
  return <p className={cn('text-[13px] text-text-secondary', className)}>{children}</p>;
}

export function MonoLabel({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        'font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-text-meta',
        className,
      )}
    >
      {children}
    </span>
  );
}
