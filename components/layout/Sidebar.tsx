'use client';

import { Compass, Folder, MessageSquare, Plus, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { User } from '@/lib/mock/types';
import { useUnreadStore } from '@/lib/stores/useUnreadStore';
import { Logo } from '@/components/ui';

import { NavItem } from './NavItem';
import { ThemeToggle } from './ThemeToggle';
import { UserCard } from './UserCard';

export interface SidebarProps {
  currentUser: Pick<User, 'name' | 'username' | 'avatarUrl' | 'availabilityLevel'>;
}

export function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();
  const unreadCount = useUnreadStore((s) => s.unreadConversationIds.size);
  const profileHref = `/profile/${currentUser.username}`;
  const isHome = pathname === '/home';
  const isProfile = pathname.startsWith('/profile');
  const isMyProjects = pathname === '/projects';

  return (
    // <768px: hidden (replaced by BottomNav). 768–1200px: 64px icon-only rail. ≥1200px: full 248px.
    // Design decision: the old always-dark rail is gone. The shell is now a theme-aware paper
    // rail — hairline border, cobalt active states — so the blueprint identity flips wholesale
    // with the theme instead of anchoring a permanent dark strip.
    <aside className="relative hidden flex-none flex-col gap-7 border-r border-border-light bg-surface px-3 py-6 text-sidebar-nav tablet:flex tablet:w-16 desktop:w-[248px] desktop:px-5">
      <Link
        href="/home"
        className="relative flex justify-center desktop:justify-start"
        aria-label="Pakkam Project home"
      >
        <Logo wordmarkClassName="hidden desktop:inline" />
      </Link>

      <div className="relative flex flex-col gap-2">
        <p className="hidden px-[13px] font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-text-meta desktop:block">
          Menu
        </p>
        <nav className="flex flex-col gap-1">
          <NavItem href="/home" icon={Compass} label="Home" active={isHome} />
          <NavItem href="/projects" icon={Folder} label="My Projects" active={isMyProjects} />
          <NavItem
            href="/messages"
            icon={MessageSquare}
            label="Messages"
            active={pathname.startsWith('/messages')}
            badge={unreadCount}
          />
          <NavItem href={profileHref} icon={UserIcon} label="Profile" active={isProfile} />
        </nav>
      </div>

      {/* Hero CTA: shared brand gradient + inner highlight ring — the one "lit" element on the
          paper rail. <desktop: shrinks to an icon-only square, keeping the gradient identity. */}
      <Link
        href="/projects/new"
        aria-label="Post a Project"
        className="relative flex items-center justify-center gap-2 rounded-md bg-brand-gradient px-0 py-3 text-sm font-semibold text-white shadow-fab ring-1 ring-inset ring-white/25 transition-all duration-200 ease-out-soft hover:-translate-y-px hover:brightness-105 active:translate-y-0 desktop:px-4"
      >
        <Plus className="h-[18px] w-[18px] flex-none" aria-hidden />
        <span className="hidden desktop:inline">Post a Project</span>
      </Link>

      <div className="flex-1" />

      <ThemeToggle className="self-center desktop:self-start" />
      <UserCard user={currentUser} />
    </aside>
  );
}
