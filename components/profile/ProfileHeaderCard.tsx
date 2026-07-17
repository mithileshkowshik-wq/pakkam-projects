import { MapPin } from 'lucide-react';
import Link from 'next/link';

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
    <Card className="overflow-hidden p-0">
      {/* Brand banner with the venn-mark motif echoed as oversized translucent circle outlines. */}
      <div className="relative h-[116px] overflow-hidden bg-banner-gradient">
        <div
          aria-hidden
          className="absolute -top-14 right-6 h-40 w-40 rounded-full border-[10px] border-white/15"
        />
        <div
          aria-hidden
          className="absolute -top-6 right-24 h-28 w-28 rounded-full border-[10px] border-white/10"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/10 blur-2xl"
        />
      </div>

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
              <Link href="/profile/edit">
                <Button>Edit Profile</Button>
              </Link>
            </div>
          ) : (
            <MessageButton userId={user.id} className="mt-[52px]" />
          )}
        </div>

        <H1 className="mt-3.5 text-[28px]">{user.name}</H1>
        {user.headline && (
          <p className="mt-1 text-[15px] font-medium text-primary-hover">{user.headline}</p>
        )}
        {user.bio && <Sub className="mt-1.5">{user.bio}</Sub>}

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          {/* StatusBadge is typed to ProjectStage; this teal "Available" pill is a one-off, so
              built inline with the same teal tokens rather than bending StatusBadge's prop type. */}
          <span className="inline-flex items-center gap-[7px] whitespace-nowrap rounded-pill bg-teal-bg px-3 py-[5px] text-label font-semibold text-teal-text ring-1 ring-inset ring-teal/20">
            <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-teal" aria-hidden />
            {AVAILABILITY_LABEL[user.availabilityLevel]}
          </span>

          {user.location && (
            <Chip variant="mut" size="sm">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {user.location}
            </Chip>
          )}
        </div>

        {user.skills.length > 0 && (
          <div className="mt-5">
            <MonoLabel>Skills</MonoLabel>
            <div className="mt-2 flex flex-wrap gap-2">
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
        )}

        {user.domains.length > 0 && (
          <div className="mt-4">
            <MonoLabel>Into</MonoLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.domains.map((d) => (
                <Chip key={d.id} variant="mut" size="sm">
                  {d.emoji ? `${d.emoji} ` : ''}
                  {d.name}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
