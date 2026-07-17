import { STAGE_BADGE } from '@/lib/constants';
import type { ProjectStage } from '@/lib/mock/types';
import { cn } from '@/lib/utils';

const VARIANT_STYLES = {
  idea: { badge: 'bg-idea-bg text-idea-text', dot: 'bg-idea-dot' },
  prog: { badge: 'bg-teal-bg text-teal-text', dot: 'bg-teal' },
  launch: { badge: 'bg-launch-bg text-launch-text', dot: 'bg-launch-dot' },
} as const;

export interface StatusBadgeProps {
  stage: ProjectStage;
  className?: string;
}

export function StatusBadge({ stage, className }: StatusBadgeProps) {
  const { variant, label } = STAGE_BADGE[stage];
  const style = VARIANT_STYLES[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[7px] whitespace-nowrap rounded-pill px-3 py-[5px] text-label font-semibold ring-1 ring-inset ring-ink/5',
        style.badge,
        className,
      )}
    >
      {/* dot colour is intentionally distinct from text (e.g. idea dot #EF626C vs idea text #C23F49) */}
      <span className={cn('h-[7px] w-[7px] rounded-full', style.dot, variant === 'prog' && 'animate-pulse')} aria-hidden />
      {label}
    </span>
  );
}
