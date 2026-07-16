import type { ReactNode } from 'react';

import { Logo } from '@/components/ui';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex justify-center">
          {/* wordmark defaults to white for the dark sidebar; force ink on this light canvas */}
          <Logo wordmarkClassName="text-ink" />
        </div>
        {children}
      </div>
    </div>
  );
}
