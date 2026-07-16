import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm border px-[18px] py-2.5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'border-border bg-surface text-ink',
        primary: 'border-primary bg-primary text-white shadow-btn-primary',
        ghost: 'border-border bg-transparent text-ink',
        // dim colours (#EFE2E4 bg / #A5A1B8 text) have no exact tokens — approximated with launch-bg / text-meta
        dim: 'border-transparent bg-launch-bg text-text-meta shadow-none',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, loading, disabled, children, type = 'button', ...props }, ref) => {
    const isDisabled = Boolean(disabled) || Boolean(loading);
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : children}
      </button>
    );
  },
);
Button.displayName = 'Button';
