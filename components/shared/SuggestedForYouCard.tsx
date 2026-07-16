import type { User } from '@/lib/mock/types';
import { Avatar, Card, Chip, H3, Meta, SectionDivider } from '@/components/ui';

export interface SuggestedForYouCardProps {
  people: Pick<User, 'id' | 'username' | 'name' | 'avatarUrl' | 'headline' | 'skills'>[];
}

export function SuggestedForYouCard({ people }: SuggestedForYouCardProps) {
  return (
    <Card>
      <H3>Suggested for you</H3>
      <Meta className="mt-0.5 text-text-meta">Based on your skills &amp; interests</Meta>

      <div className="mt-4 flex flex-col">
        {people.map((person, i) => (
          <div key={person.id}>
            {i > 0 && <SectionDivider tight className="my-3" />}
            <div className="flex items-start gap-3">
              <Avatar size={42} name={person.name} src={person.avatarUrl} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">{person.name}</p>
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
            </div>
          </div>
        ))}
      </div>

      {/* Non-functional visual affordance: there's no "all suggestions" screen in scope this pass. */}
      <span className="mt-4 inline-block text-[13.5px] font-semibold text-primary">View all →</span>
    </Card>
  );
}
