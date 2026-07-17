import type { ReactNode } from 'react';

import { Logo } from '@/components/ui';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-10">
      {/* Decorative blueprint elements — cobalt glows + an oversized outline of the logo's
          adjacent-panes mark. Pure CSS, token-backed, sit behind the card in both themes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 right-[12%] h-80 w-80 rounded-full bg-primary-light/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-[8%] h-72 w-72 rounded-full bg-teal/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[16%] top-[12%] hidden h-32 w-32 rounded-[26px] border-[10px] border-primary/10 tablet:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[22%] top-[24%] hidden h-32 w-32 rounded-[26px] border-[10px] border-primary/5 tablet:block"
      />

      <div className="relative w-full max-w-md duration-500 ease-out-soft animate-in fade-in slide-in-from-bottom-3">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
