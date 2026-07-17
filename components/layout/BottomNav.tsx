'use client';

import { Compass, Folder, MessageSquare, Plus, User as UserIcon, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { User } from '@/lib/mock/types';
import { useUnreadStore } from '@/lib/stores/useUnreadStore';
import { cn } from '@/lib/utils';

export interface BottomNavProps {
  currentUser: Pick<User, 'name' | 'username' | 'avatarUrl' | 'availabilityLevel'>;
}

/**
 * <768px bottom tab bar that replaces the sidebar entirely. CSS-only visibility (`tablet:hidden`)
 * so there's no hydration mismatch. Reuses the Sidebar's href logic.
 *
 * Design decision (revisits the earlier "plain 5th tab" call): "Post a Project" is the app's
 * primary action, so on mobile it gets the classic raised center FAB — the same brand gradient as
 * the Sidebar CTA — flanked by the four ordinary tabs. The bar itself is translucent + blurred
 * with an upward shadow so it reads as a floating dock rather than a hard cutoff.
 */
export function BottomNav({ currentUser }: BottomNavProps) {
  const pathname = usePathname();
  const unreadCount = useUnreadStore((s) => s.unreadConversationIds.size);
  const profileHref = `/profile/${currentUser.username}`;
  const isHome = pathname === '/home';
  const isProfile = pathname.startsWith('/profile');
  const isMyProjects = pathname === '/projects';
  const isNew = pathname.startsWith('/projects/new');
  const isMessages = pathname.startsWith('/messages');

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border-light bg-surface/90 pb-[env(safe-area-inset-bottom)] shadow-rail backdrop-blur-md tablet:hidden"
    >
      <Tab href="/home" icon={Compass} label="Home" active={isHome} />
      <Tab href="/projects" icon={Folder} label="Projects" active={isMyProjects} />

      {/* Center FAB — pokes above the bar. aria-current keeps the active state announced even
          though it's styled as a button, not a tab. */}
      <div className="flex flex-1 items-start justify-center">
        <Link
          href="/projects/new"
          aria-label="Post a Project"
          aria-current={isNew ? 'page' : undefined}
          className={cn(
            '-mt-[22px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-gradient text-white shadow-fab ring-4 ring-surface transition-transform duration-200 ease-out-soft active:scale-95',
            isNew && 'ring-accent-border',
          )}
        >
          <Plus className="h-6 w-6" aria-hidden />
        </Link>
      </div>

      <Tab href="/messages" icon={MessageSquare} label="Messages" active={isMessages} badge={unreadCount} />
      <Tab href={profileHref} icon={UserIcon} label="Profile" active={isProfile} />
    </nav>
  );
}

interface TabProps {
  href?: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  disabled?: boolean;
  badge?: number;
}

const TAB_BASE =
  'flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10.5px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary';

function Tab({ href, icon: Icon, label, active, disabled, badge }: TabProps) {
  const content = (
    <>
      <span className="relative">
        <Icon className="h-5 w-5" aria-hidden strokeWidth={active ? 2.4 : 2} />
        {!!badge && badge > 0 && (
          <span
            aria-hidden
            className="absolute -right-1.5 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-pill bg-brand-gradient px-[3px] text-[9px] font-bold leading-none text-white"
          >
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </span>
      <span className={cn(active && 'font-semibold')}>{label}</span>
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
