'use client';

import { Compass, Folder, MessageSquare, Plus, User as UserIcon, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { User } from '@/lib/mock/types';
import { cn } from '@/lib/utils';

export interface BottomNavProps {
  currentUser: Pick<User, 'name' | 'username' | 'avatarUrl' | 'availabilityLevel'>;
}

/**
 * <768px bottom tab bar that replaces the sidebar entirely. CSS-only visibility (`tablet:hidden`)
 * so there's no hydration mismatch. Reuses the Sidebar's href logic.
 *
 * Judgment call: the desktop gradient "Post a Project" CTA becomes an ordinary 5th tab here (a
 * plain Plus icon, no special styling) per the spec's "5 tab icons" framing — a floating gradient
 * pill would fight the flat tab-bar layout.
 */
export function BottomNav({ currentUser }: BottomNavProps) {
  const pathname = usePathname();
  const profileHref = `/profile/${currentUser.username}`;
  const isHome = pathname === '/home';
  const isProfile = pathname.startsWith('/profile');
  const isNew = pathname.startsWith('/projects/new');

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] tablet:hidden"
    >
      <Tab href="/home" icon={Compass} label="Home" active={isHome} />
      {/* "My Projects" reasonably overlaps the owner's profile this pass (no dedicated screen in scope). */}
      <Tab href={profileHref} icon={Folder} label="My Projects" active={isProfile} />
      {/* Messaging is out of scope; disabled so it reads as "coming soon" not a dead link (matches Sidebar). */}
      <Tab icon={MessageSquare} label="Messages" disabled />
      <Tab href={profileHref} icon={UserIcon} label="Profile" active={isProfile} />
      <Tab href="/projects/new" icon={Plus} label="Post a Project" active={isNew} />
    </nav>
  );
}

interface TabProps {
  href?: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  disabled?: boolean;
}

const TAB_BASE =
  'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary';

function Tab({ href, icon: Icon, label, active, disabled }: TabProps) {
  const content = (
    <>
      <Icon className="h-5 w-5" aria-hidden />
      <span>{label}</span>
    </>
  );

  if (disabled || !href) {
    return (
      <span
        className={cn(TAB_BASE, 'cursor-not-allowed text-text-secondary opacity-60')}
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
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={cn(TAB_BASE, active ? 'text-primary' : 'text-text-secondary')}
    >
      {content}
    </Link>
  );
}
