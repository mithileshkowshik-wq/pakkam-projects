'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

import { SuggestedForYouCard, type SuggestedForYouCardProps } from './SuggestedForYouCard';
import { SuggestedProjectsCard, type SuggestedProjectsCardProps } from './SuggestedProjectsCard';

export interface SuggestedRailProps {
  people: SuggestedForYouCardProps['people'];
  projects: SuggestedProjectsCardProps['projects'];
}

/**
 * Home's suggestions rail.
 * ≥1200px: always-visible 320px column (unchanged desktop behavior).
 * <1200px: collapsed by default behind a toggle; expanding renders the same cards inline as their
 * own single column (no modal, no permanent layout space when collapsed).
 *
 * Judgment call: the collapse toggle is an inline ghost button placed above the rail content
 * (which, via order, sits above the feed <desktop) — simplest affordance that stays in flow.
 */
export function SuggestedRail({ people, projects }: SuggestedRailProps) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="order-first flex flex-col gap-3 desktop:order-2 desktop:w-[320px] desktop:flex-none desktop:gap-4">
      <Button
        variant="ghost"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="self-start desktop:hidden"
      >
        Suggestions
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </Button>

      <div
        className={cn(
          'flex-col gap-4',
          open ? 'flex duration-300 ease-out-soft animate-in fade-in slide-in-from-top-2' : 'hidden',
          'desktop:flex',
        )}
      >
        <SuggestedForYouCard people={people} />
        <SuggestedProjectsCard projects={projects} />
      </div>
    </aside>
  );
}
