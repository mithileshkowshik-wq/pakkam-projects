import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface NavItemProps {
  /** Omit for a non-navigable "coming soon" row (e.g. Messages, out of scope this pass). */
  href?: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  disabled?: boolean;
  /** Unread-count style badge, e.g. the Messages nav item. Renders as a small dot pinned to the
   * icon's corner so it still reads in the icon-only 768–1200px rail, not just the labeled state. */
  badge?: number;
}

// <desktop the rail is icon-only: center the icon, drop the label + horizontal padding.
// `relative` anchors the active-state cobalt indicator bar pinned to the item's left edge.
const BASE =
  'relative flex items-center justify-center gap-3 rounded-tile px-0 py-[11px] text-[14.5px] font-medium transition-colors duration-200 desktop:justify-start desktop:px-[13px]';
const ACTIVE = 'bg-tag-bg text-tag-text';
const INACTIVE = 'text-sidebar-nav hover:bg-bg hover:text-ink';

export function NavItem({ href, icon: Icon, label, active, disabled, badge }: NavItemProps) {
  const content = (
    <>
      {active && (
        <span
          aria-hidden
          className="absolute -left-px top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary shadow-chip-primary"
        />
      )}
      <span className="relative flex-none">
        <Icon className={cn('h-[18px] w-[18px]', active && 'text-primary')} aria-hidden />
        {!!badge && badge > 0 && (
          <span
            aria-hidden
            className="absolute -right-1.5 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-pill bg-brand-gradient px-[3px] text-[9.5px] font-bold leading-none text-white shadow-chip-primary"
          >
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </span>
      <span className="hidden desktop:inline">{label}</span>
      {!!badge && badge > 0 && <span className="sr-only">, {badge} unread</span>}
    </>
  );

  if (disabled || !href) {
    return (
      <span
        className={cn(BASE, INACTIVE, 'cursor-not-allowed opacity-60')}
        aria-disabled="true"
        aria-label={label}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(BASE, active ? ACTIVE : INACTIVE)}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
    >
      {content}
    </Link>
  );
}
