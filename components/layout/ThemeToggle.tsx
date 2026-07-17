'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  className?: string;
}

// Reads/writes the DOM + localStorage directly rather than a store — only this button and the
// pre-paint script in app/layout.tsx ever touch theme state, so a zustand store would be
// unjustified indirection. Initial state is read from the DOM in an effect (not seeded from
// SSR-time React state) to avoid a hydration mismatch, since the class is set by that pre-paint
// script before React ever hydrates.
export function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'flex h-9 w-9 flex-none items-center justify-center rounded-tile border border-border-light bg-surface text-text-secondary transition-colors duration-200 hover:border-accent-border hover:text-primary',
        className,
      )}
    >
      {/* Render nothing until mounted (isDark === null) to avoid flashing the wrong icon. */}
      {isDark === null ? null : isDark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden />
      )}
    </button>
  );
}
