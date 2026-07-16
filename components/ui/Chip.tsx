import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const chipVariants = cva(
  'inline-flex items-center gap-[7px] whitespace-nowrap rounded-pill border font-semibold transition-all duration-150',
  {
    variants: {
      variant: {
        // default text colour #4b5563 has no token — mapped to text-secondary (closest neutral)
        default: 'border-border bg-surface text-text-secondary',
        fill: 'border-primary bg-primary text-white shadow-chip-primary',
        tag: 'border-transparent bg-tag-bg text-tag-text',
        mut: 'border-border bg-bg text-text-secondary',
      },
      size: {
        default: 'px-[14px] py-[7px] text-[13px]',
        sm: 'px-[10px] py-1 text-xs',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ChipProps extends VariantProps<typeof chipVariants> {
  children: ReactNode;
  className?: string;
  /** Used for the remove button's aria-label; falls back to string children. */
  label?: string;
  /** Passing `selected` or `onClick` renders the chip as an interactive toggle button. */
  selected?: boolean;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

// Note: don't combine interactive (onClick/selected) with `removable` — that nests two <button>s.
// In practice removable chips are static labels (TagPicker) and toggle chips aren't removable.
export function Chip({
  children,
  className,
  label,
  selected,
  onClick,
  removable,
  onRemove,
  variant,
  size,
}: ChipProps) {
  const interactive = onClick !== undefined || selected !== undefined;
  const removeLabel = label ?? (typeof children === 'string' ? children : 'tag');

  const inner = (
    <>
      {children}
      {removable && (
        <button
          type="button"
          aria-label={`Remove ${removeLabel}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="-mr-1 ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-3 w-3" aria-hidden />
        </button>
      )}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={cn(
          chipVariants({ variant, size }),
          'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className,
        )}
      >
        {inner}
      </button>
    );
  }

  return (
    <span className={cn(chipVariants({ variant, size }), 'cursor-default', className)}>
      {inner}
    </span>
  );
}
