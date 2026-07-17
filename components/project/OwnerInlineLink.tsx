'use client';

import Link from 'next/link';

import { COMMITMENT_LABEL } from '@/lib/constants';
import type { CommitmentLevel, User } from '@/lib/mock/types';
import { Avatar } from '@/components/ui';

export interface OwnerInlineLinkProps {
  owner: Pick<User, 'username' | 'name' | 'avatarUrl'>;
  commitmentLevel: CommitmentLevel;
}

// 'use client' leaf, isolated from the otherwise-server ProjectCard: the card itself is already a
// Link to the project, so this needs its own nested Link + stopPropagation to reach the profile
// instead — same isolation pattern as MessageButton/SignOutButton.
export function OwnerInlineLink({ owner, commitmentLevel }: OwnerInlineLinkProps) {
  return (
    <Link
      href={`/profile/${owner.username}`}
      onClick={(e) => e.stopPropagation()}
      className="group/owner relative z-10 flex min-w-0 items-center gap-2.5"
    >
      <Avatar
        size={32}
        name={owner.name}
        src={owner.avatarUrl}
        className="transition-transform duration-200 ease-out-soft group-hover/owner:scale-105"
      />
      <div className="min-w-0">
        <p className="truncate text-note font-semibold text-ink transition-colors duration-200 group-hover/owner:text-primary-hover">
          {owner.name}
        </p>
        <p className="truncate text-meta text-text-secondary">{COMMITMENT_LABEL[commitmentLevel]}</p>
      </div>
    </Link>
  );
}
