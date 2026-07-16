import { cn } from '@/lib/utils';

export interface SectionDividerProps {
  /** Tight variant (.hrt): border-light, no margin — for divider lines inside stacked list rows. */
  tight?: boolean;
  className?: string;
}

export function SectionDivider({ tight, className }: SectionDividerProps) {
  return (
    <hr
      className={cn(
        'border-0 border-t',
        tight ? 'my-0 border-border-light' : 'my-[26px] border-border',
        className,
      )}
    />
  );
}
