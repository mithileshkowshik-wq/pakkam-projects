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
        'flex items-center gap-[11px] font-display text-[17px] font-bold tracking-[-0.01em] text-white',
        className,
      )}
    >
      {/* shadow-chip-primary approximates the design's mark glow (0 4px 14px -2px rgba(239,98,108,.7)) with a token */}
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-sm bg-gradient-to-br from-primary-light to-primary shadow-chip-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          {/* venn mark: two overlapping circles, coloured with literal #fff (intentional inline SVG stroke) */}
          <circle cx="9.3" cy="12" r="4.6" stroke="#fff" strokeWidth="2.1" />
          <circle cx="14.7" cy="12" r="4.6" stroke="#fff" strokeWidth="2.1" />
        </svg>
      </span>
      <span className={wordmarkClassName}>Pakkam Project</span>
    </span>
  );
}
