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
const BASE =
  'flex items-center justify-center gap-3 rounded-[11px] px-0 py-[11px] text-[14.5px] font-medium transition-colors desktop:justify-start desktop:px-[13px]';
// active gradient approximates linear-gradient(100deg, rgba(244,134,141,.22), rgba(239,98,108,.08))
const ACTIVE =
  'bg-gradient-to-r from-primary-light/[.22] to-primary/[.08] text-white shadow-[inset_0_0_0_1px_rgba(244,134,141,.35)]';
const INACTIVE = 'text-sidebar-nav hover:text-white';

export function NavItem({ href, icon: Icon, label, active, disabled, badge }: NavItemProps) {
  const content = (
    <>
      <span className="relative flex-none">
        <Icon className="h-[18px] w-[18px]" aria-hidden />
        {!!badge && badge > 0 && (
          <span
            aria-hidden
            className="absolute -right-1.5 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-pill bg-primary px-[3px] text-[9.5px] font-bold leading-none text-white"
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
    <Link href={href} className={cn(BASE, active ? ACTIVE : INACTIVE)} aria-label={label}>
      {content}
    </Link>
  );
}
