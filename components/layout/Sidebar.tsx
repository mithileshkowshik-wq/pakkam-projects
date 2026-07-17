'use client';

import { Compass, Folder, MessageSquare, Plus, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { User } from '@/lib/mock/types';
import { useUnreadStore } from '@/lib/stores/useUnreadStore';
import { Logo } from '@/components/ui';

import { NavItem } from './NavItem';
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

  return (
    // <768px: hidden (replaced by BottomNav). 768–1200px: 64px icon-only rail. ≥1200px: full 240px.
    <aside className="hidden flex-none flex-col gap-6 bg-ink px-3 py-5 text-sidebar-nav tablet:flex tablet:w-16 desktop:w-[240px] desktop:p-5">
      <Link href="/home" className="flex justify-center desktop:justify-start" aria-label="Pakkam Project home">
        <Logo wordmarkClassName="hidden desktop:inline" />
      </Link>

      <nav className="flex flex-col gap-1">
        <NavItem href="/home" icon={Compass} label="Home" active={isHome} />
        {/* "My Projects" reasonably overlaps the owner's profile this pass (no dedicated screen in scope). */}
        <NavItem href={profileHref} icon={Folder} label="My Projects" active={isProfile} />
        <NavItem
          href="/messages"
          icon={MessageSquare}
          label="Messages"
          active={pathname.startsWith('/messages')}
          badge={unreadCount}
        />
        <NavItem href={profileHref} icon={UserIcon} label="Profile" active={isProfile} />
      </nav>

      {/* One-off hero CTA: arbitrary glow shadow (no token matches 0 10px 24px -8px rgba(239,98,108,.8)). */}
      {/* <desktop: shrinks to an icon-only square button (label hidden), keeping the gradient identity. */}
      <Link
        href="/projects/new"
        aria-label="Post a Project"
        className="flex items-center justify-center gap-2 rounded-[12px] bg-gradient-to-br from-primary-light to-primary px-0 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(239,98,108,.8)] transition-transform hover:-translate-y-px desktop:px-4"
      >
        <Plus className="h-[18px] w-[18px] flex-none" aria-hidden />
        <span className="hidden desktop:inline">Post a Project</span>
      </Link>

      <div className="flex-1" />

      <UserCard user={currentUser} />
    </aside>
  );
}
