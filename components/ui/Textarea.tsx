'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

// rounded-xl is Tailwind's default 12px (matches .ta). Override min-height via className when needed.
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[96px] w-full rounded-xl border border-border bg-surface p-[14px] text-[14.5px] leading-normal text-ink transition-all duration-150 placeholder:text-text-meta focus:border-[1.5px] focus:border-primary focus:shadow-focus focus:outline-none',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
