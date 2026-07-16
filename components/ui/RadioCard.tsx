import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface RadioCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  icon?: ReactNode;
  className?: string;
}

// Compose several of these inside a parent element with role="radiogroup".
// RadioCard itself renders role="radio" but has no knowledge of its siblings.
export function RadioCard({ label, selected, onSelect, icon, className }: RadioCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border bg-surface px-4 py-[14px] text-left text-[14.5px] font-medium text-ink transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        // .rcard.on: bg-primary/10 approximates the design's pale #FDF1F2 tint; shadow-focus ~ its 4px ring
        selected ? 'border-[1.5px] border-primary bg-primary/10 shadow-focus' : 'border-border',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full border-2',
          selected ? 'border-primary' : 'border-border',
        )}
      >
        {/* recreates .radio.on's radial-gradient filled centre with a solid inner dot */}
        {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>
      {icon}
      <span>{label}</span>
    </button>
  );
}
