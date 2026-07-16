import Link from 'next/link';

import type { User } from '@/lib/mock/types';
import { Avatar, Card, Chip, H3, Meta } from '@/components/ui';

export interface OwnerCardProps {
  // Self-sufficient once given a real User: Project.owner alone lacks `skills`, so the Project
  // Detail page should look the owner up via getUserByUsername and pass the full User here.
  owner: Pick<User, 'name' | 'username' | 'avatarUrl' | 'headline' | 'skills'>;
}

export function OwnerCard({ owner }: OwnerCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar size={54} name={owner.name} src={owner.avatarUrl} />
        <div className="min-w-0">
          <H3 className="text-[16px]">{owner.name}</H3>
          {owner.headline && <Meta className="text-text-meta">{owner.headline}</Meta>}
        </div>
      </div>

      {owner.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {owner.skills.slice(0, 3).map((skill) => (
            <Chip key={skill.id} variant="tag" size="sm">
              {skill.name}
            </Chip>
          ))}
        </div>
      )}

      <Link
        href={`/profile/${owner.username}`}
        className="text-[13.5px] font-semibold text-primary hover:text-primary-hover"
      >
        View full profile →
      </Link>
    </Card>
  );
}
