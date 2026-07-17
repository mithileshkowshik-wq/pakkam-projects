import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import type { User } from '@/lib/mock/types';
import { Avatar, Card, Chip, H3, Meta, MonoLabel } from '@/components/ui';

export interface OwnerCardProps {
  // Self-sufficient once given a real User: Project.owner alone lacks `skills`, so the Project
  // Detail page should look the owner up via getUserByUsername and pass the full User here.
  owner: Pick<User, 'name' | 'username' | 'avatarUrl' | 'headline' | 'skills'>;
}

export function OwnerCard({ owner }: OwnerCardProps) {
  return (
    // Signature gradient hairline across the top marks this as the project's "byline" card.
    <Card className="relative flex flex-col gap-3 overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-brand-gradient">
      <MonoLabel>Project owner</MonoLabel>

      <Link href={`/profile/${owner.username}`} className="group flex items-center gap-3">
        <Avatar
          size={54}
          name={owner.name}
          src={owner.avatarUrl}
          className="transition-transform duration-200 ease-out-soft group-hover:scale-105"
        />
        <div className="min-w-0">
          <H3 className="text-[16px] transition-colors duration-200 group-hover:text-primary-hover">
            {owner.name}
          </H3>
          {owner.headline && <Meta className="text-text-meta">{owner.headline}</Meta>}
        </div>
      </Link>

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
        className="group/link inline-flex items-center gap-1.5 text-note font-semibold text-primary transition-colors hover:text-primary-hover"
      >
        View full profile
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-200 ease-out-soft group-hover/link:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </Card>
  );
}
