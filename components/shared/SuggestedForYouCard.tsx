import Link from 'next/link';

import type { User } from '@/lib/mock/types';
import { Avatar, Card, Chip, H3, Meta, SectionDivider } from '@/components/ui';

export interface SuggestedForYouCardProps {
  people: Pick<User, 'id' | 'username' | 'name' | 'avatarUrl' | 'headline' | 'skills'>[];
}

export function SuggestedForYouCard({ people }: SuggestedForYouCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
        <H3>Suggested for you</H3>
      </div>
      <Meta className="mt-0.5 text-text-meta">Based on your skills &amp; interests</Meta>

      {people.length === 0 ? (
        <Meta className="mt-4 text-text-secondary">
          No matches yet — as more people join and fill out their profile, suggestions will show up here.
        </Meta>
      ) : (
        <div className="mt-4 flex flex-col">
          {people.map((person, i) => (
            <div key={person.id}>
              {i > 0 && <SectionDivider tight className="my-3" />}
              <Link
                href={`/profile/${person.username}`}
                className="group -mx-2 flex items-start gap-3 rounded-[12px] px-2 py-1.5 transition-colors duration-200 hover:bg-bg/70"
              >
                <Avatar size={42} name={person.name} src={person.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink transition-colors duration-200 group-hover:text-primary-hover">
                    {person.name}
                  </p>
                  {person.headline && (
                    <p className="truncate text-[12.5px] text-text-secondary">{person.headline}</p>
                  )}
                  {person.skills.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {person.skills.slice(0, 2).map((skill) => (
                        <Chip key={skill.id} variant="tag" size="sm">
                          {skill.name}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
