import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  /** Class applied to the wordmark text (e.g. to hide it on the icon-only rail). */
  wordmarkClassName?: string;
}

export function Logo({ className, wordmarkClassName }: LogoProps) {
  return (
    <span
      className={cn(
        'flex items-center gap-[10px] font-display text-[17px] font-bold tracking-[-0.01em] text-ink',
        className,
      )}
    >
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-tile bg-brand-gradient text-white shadow-chip-primary ring-1 ring-inset ring-white/20">
        {/* "Pakkam" = beside/adjacent: two offset blueprint panes joining at the corner.
            currentColor strokes so the mark inherits its context (white on the gradient tile)
            and stays theme-aware anywhere it's reused. */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="3.1" y="3.1" width="9.2" height="9.2" rx="2.6" stroke="currentColor" strokeWidth="1.8" />
          <rect x="7.7" y="7.7" width="9.2" height="9.2" rx="2.6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
      <span className={wordmarkClassName}>Pakkam Project</span>
    </span>
  );
}
