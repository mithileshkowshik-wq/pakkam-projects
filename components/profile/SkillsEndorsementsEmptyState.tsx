import { Star } from 'lucide-react';

import { EmptyState } from '@/components/ui';

export interface SkillsEndorsementsEmptyStateProps {
  className?: string;
}

export function SkillsEndorsementsEmptyState({
  className,
}: SkillsEndorsementsEmptyStateProps) {
  return (
    <EmptyState
      className={className}
      icon={<Star className="h-5 w-5" aria-hidden />}
      heading="No endorsements yet"
      subtext="They'll appear here after your first collaborations."
    />
  );
}
