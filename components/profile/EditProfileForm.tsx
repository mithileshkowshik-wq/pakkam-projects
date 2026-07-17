'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';

import { saveProfile } from '@/app/(main)/profile/edit/actions';
import { Button, H1, Meta, Sub } from '@/components/ui';
import type { Domain, Skill, User } from '@/lib/data';
import { useProfileFieldsForm } from '@/hooks/useProfileFieldsForm';

import { ProfileFieldsFieldset } from './ProfileFieldsFieldset';

export interface EditProfileFormProps {
  user: User;
  skills: Skill[];
  domains: Domain[];
}

export function EditProfileForm({ user, skills, domains }: EditProfileFormProps) {
  const form = useProfileFieldsForm({
    headline: user.headline ?? '',
    bio: user.bio ?? '',
    availabilityLevel: user.availabilityLevel,
    location: user.location ?? '',
    skillIds: user.skills.map((s) => s.id),
    domainIds: user.domains.map((d) => d.id),
  });
  const { state } = form;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = () =>
    startTransition(async () => {
      const result = await saveProfile(state);
      if (!result.ok) setError(result.error ?? 'Something went wrong. Please try again.');
    });

  return (
    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
      <H1 className="text-[26px]">Edit profile</H1>
      <Sub className="mt-1.5">Update how you show up to other builders.</Sub>

      <div className="mt-6">
        <ProfileFieldsFieldset state={state} form={form} skills={skills} domains={domains} includeHeadline />
      </div>

      {error && <Meta className="mt-4 text-primary">{error}</Meta>}

      <div className="mt-8 flex items-center justify-end gap-3">
        <Link href={`/profile/${user.username}`}>
          <Button variant="ghost" disabled={isPending}>
            Cancel
          </Button>
        </Link>
        <Button variant="primary" onClick={submit} loading={isPending}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
