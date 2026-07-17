import Link from 'next/link';

import type { User } from '@/lib/mock/types';
import { Avatar, Card, H3, Meta } from '@/components/ui';

export interface TeamMembersCardProps {
  collaborators: Pick<User, 'id' | 'username' | 'name' | 'avatarUrl' | 'headline'>[];
}

export function TeamMembersCard({ collaborators }: TeamMembersCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <H3 className="text-[16px]">Team members</H3>
        {collaborators.length > 0 && (
          <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-pill bg-tag-bg px-1.5 text-fine font-bold text-tag-text">
            {collaborators.length}
          </span>
        )}
      </div>

      {collaborators.length === 0 ? (
        <div className="rounded-md border border-dashed border-accent-border/70 bg-bg/40 p-4">
          <Meta className="text-text-secondary">
            No collaborators yet — accepted requests will show up here.
          </Meta>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {collaborators.map((member) => (
            <Link
              key={member.id}
              href={`/profile/${member.username}`}
              className="group -mx-2 flex items-center gap-3 rounded-[12px] px-2 py-1.5 transition-colors duration-200 hover:bg-bg/70"
            >
              <Avatar size={40} name={member.name} src={member.avatarUrl} />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-ink transition-colors duration-200 group-hover:text-primary-hover">
                  {member.name}
                </p>
                {member.headline && (
                  <Meta className="truncate text-text-meta">{member.headline}</Meta>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
