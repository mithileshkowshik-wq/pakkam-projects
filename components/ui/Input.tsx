'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

// Focus treatment (.input.foc) is driven by real :focus — it shows the placeholder-coloured
// resting state until the user actually focuses, then applies the coral border + shadow-focus ring.
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-sm border border-border bg-surface px-[14px] py-3 text-body text-ink transition-all duration-200 ease-out-soft placeholder:text-text-meta hover:border-accent-border focus:border-primary focus:shadow-focus focus:outline-none',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';
