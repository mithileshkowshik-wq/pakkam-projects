import { cn } from '@/lib/utils';

export interface CharCounterProps {
  count: number;
  max: number;
  className?: string;
}

// Pure display, driven entirely by parent-supplied props — no client state needed.
export function CharCounter({ count, max, className }: CharCounterProps) {
  const over = count > max;
  return (
    <span
      className={cn(
        'font-mono text-[11px] tabular-nums tracking-[0.06em]',
        // count colour #BCAFB3 has no token — text-meta is the nearest; turns coral when over limit
        over ? 'text-primary' : 'text-text-meta',
        className,
      )}
    >
      {count} / {max}
    </span>
  );
}
