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
    <div className="flex items-center justify-center gap-3 rounded-xl border-transparent p-0 desktop:justify-start desktop:border desktop:border-white/[.06] desktop:bg-white/[.04] desktop:p-[11px]">
      <Avatar size={34} name={user.name} src={user.avatarUrl} />
      <div className="hidden min-w-0 flex-1 desktop:block">
        <p className="truncate text-[13.5px] font-semibold text-white">{user.name}</p>
        <p className="truncate text-[11.5px] text-sidebar-userSub">
          {AVAILABILITY_LABEL[user.availabilityLevel]}
        </p>
      </div>
      <SignOutIconButton className="hidden desktop:flex" icon={LogOut} />
    </div>
  );
}
