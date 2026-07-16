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
}

// <desktop the rail is icon-only: center the icon, drop the label + horizontal padding.
const BASE =
  'flex items-center justify-center gap-3 rounded-[11px] px-0 py-[11px] text-[14.5px] font-medium transition-colors desktop:justify-start desktop:px-[13px]';
// active gradient approximates linear-gradient(100deg, rgba(244,134,141,.22), rgba(239,98,108,.08))
const ACTIVE =
  'bg-gradient-to-r from-primary-light/[.22] to-primary/[.08] text-white shadow-[inset_0_0_0_1px_rgba(244,134,141,.35)]';
const INACTIVE = 'text-sidebar-nav hover:text-white';

export function NavItem({ href, icon: Icon, label, active, disabled }: NavItemProps) {
  const content = (
    <>
      <Icon className="h-[18px] w-[18px] flex-none" aria-hidden />
      <span className="hidden desktop:inline">{label}</span>
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
