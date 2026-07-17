import type { ReactNode } from 'react';

import { Logo } from '@/components/ui';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-10">
      {/* Decorative brand orbs — pure CSS, sit behind the card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 right-[12%] h-80 w-80 rounded-full bg-primary-light/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-[8%] h-72 w-72 rounded-full bg-teal/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[18%] top-[14%] hidden h-36 w-36 rounded-full border-[12px] border-primary/10 tablet:block"
      />

      <div className="relative w-full max-w-md duration-500 ease-out-soft animate-in fade-in slide-in-from-bottom-3">
        <div className="mb-6 flex justify-center">
          {/* wordmark defaults to white for the dark sidebar; force ink on this light canvas */}
          <Logo wordmarkClassName="text-ink" />
        </div>
        {children}
      </div>
    </div>
  );
}
