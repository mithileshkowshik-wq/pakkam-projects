import { MapPin } from 'lucide-react';

import { AVAILABILITY_LABEL } from '@/lib/constants';
import type { User } from '@/lib/mock/types';
import { Avatar, Button, Card, Chip, H1, MonoLabel, Sub } from '@/components/ui';
import { SignOutButton } from '@/components/layout/SignOutButton';

import { MessageButton } from './MessageButton';

export interface ProfileHeaderCardProps {
  user: User;
  isOwner: boolean;
}

const MAX_SKILLS = 6;

export function ProfileHeaderCard({ user, isOwner }: ProfileHeaderCardProps) {
  const skillsOverflow = user.skills.length - MAX_SKILLS;

  return (
    <Card className="p-0 overflow-hidden">
      {/* design banner is a 120deg three-stop gradient — approximated left-to-right */}
      <div className="h-[104px] bg-gradient-to-r from-primary-light via-primary to-primary-light" />

      <div className="px-6 pb-6">
        <div className="flex items-start justify-between gap-4">
          {/* Avatar has no ring prop, so wrap it in a white-bordered ring per the design */}
          <div className="-mt-[42px] rounded-full border-4 border-white shadow-[0_6px_18px_-6px_rgba(26,26,46,.3)]">
            <Avatar size={88} name={user.name} src={user.avatarUrl} />
          </div>

          {isOwner ? (
            // Sign-out lives here too since the icon-only sidebar rail (768–1200px) and the
            // mobile bottom nav (<768px) have no persistent slot for it.
            <div className="mt-[52px] flex items-center gap-2">
              <SignOutButton />
              {/* Visual affordance only: there is no edit-profile screen in scope this pass. */}
              <Button disabled>Edit Profile</Button>
            </div>
          ) : (
            <MessageButton userId={user.id} className="mt-[52px]" />
          )}
        </div>

        <H1 className="text-[28px] mt-3.5">{user.name}</H1>
        {user.bio && <Sub className="mt-1.5">{user.bio}</Sub>}

        <div className="flex gap-2 items-center flex-wrap mt-3">
          {/* StatusBadge is typed to ProjectStage; this teal "Available" pill is a one-off, so
              built inline with the same teal tokens rather than bending StatusBadge's prop type. */}
          <span className="inline-flex items-center gap-[7px] whitespace-nowrap rounded-pill bg-teal-bg px-3 py-[5px] text-[12.5px] font-semibold text-teal-text">
            <span className="h-[7px] w-[7px] rounded-full bg-teal" aria-hidden />
            {AVAILABILITY_LABEL[user.availabilityLevel]}
          </span>

          {user.location && (
            <Chip variant="mut" size="sm">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {user.location}
            </Chip>
          )}
        </div>

        <div className="mt-4">
          <MonoLabel>Skills</MonoLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.skills.slice(0, MAX_SKILLS).map((s) => (
              <Chip key={s.id} variant="tag" size="sm">
                {s.name}
              </Chip>
            ))}
            {skillsOverflow > 0 && (
              <Chip variant="mut" size="sm">
                +{skillsOverflow}
              </Chip>
            )}
          </div>
        </div>

        <div className="mt-4">
          <MonoLabel>Into</MonoLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.domains.map((d) => (
              <Chip key={d.id} variant="mut" size="sm">
                {d.emoji ? `${d.emoji} ` : ''}
                {d.name}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
