import { LogOut } from 'lucide-react';

import { AVAILABILITY_LABEL } from '@/lib/constants';
import type { User } from '@/lib/mock/types';
import { Avatar } from '@/components/ui';

import { SignOutIconButton } from './SignOutButton';

export interface UserCardProps {
  user: Pick<User, 'name' | 'avatarUrl' | 'availabilityLevel'>;
}

export function UserCard({ user }: UserCardProps) {
  return (
    // <desktop the rail is icon-only: show just the centered avatar, drop the card chrome + text
    // (sign-out isn't reachable from this icon-only state — it's also on the owner's Profile page).
    <div className="relative flex items-center justify-center gap-3 rounded-md border-transparent p-0 transition-colors duration-200 desktop:justify-start desktop:border desktop:border-border-light desktop:bg-bg/70 desktop:p-[11px] desktop:hover:border-accent-border">
      <Avatar size={34} name={user.name} src={user.avatarUrl} />
      <div className="hidden min-w-0 flex-1 desktop:block">
        <p className="truncate text-[13.5px] font-semibold text-ink">{user.name}</p>
        <p className="truncate text-[11.5px] text-sidebar-userSub">
          {AVAILABILITY_LABEL[user.availabilityLevel]}
        </p>
      </div>
      <SignOutIconButton className="hidden desktop:flex" icon={LogOut} />
    </div>
  );
}
