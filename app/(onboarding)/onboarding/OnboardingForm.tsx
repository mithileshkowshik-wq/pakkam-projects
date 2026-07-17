'use client';

import { useTransition } from 'react';

import { Button, H1, Sub } from '@/components/ui';
import { ProfileFieldsFieldset } from '@/components/profile/ProfileFieldsFieldset';
import type { Domain, Skill } from '@/lib/data';
import { useProfileFieldsForm } from '@/hooks/useProfileFieldsForm';

import { saveOnboarding } from './actions';

export function OnboardingForm({ skills, domains }: { skills: Skill[]; domains: Domain[] }) {
  const form = useProfileFieldsForm({
    headline: '',
    bio: '',
    availabilityLevel: 'CASUAL',
    location: '',
    skillIds: [],
    domainIds: [],
  });
  const { state } = form;
  const [isPending, startTransition] = useTransition();

  const submit = () => startTransition(() => saveOnboarding(state));

  return (
    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
      <H1 className="text-[26px]">Tell us a bit about you</H1>
      <Sub className="mt-1.5">
        All optional — fill in what you like now, add the rest later from your profile.
      </Sub>

      <div className="mt-6">
        <ProfileFieldsFieldset state={state} form={form} skills={skills} domains={domains} />
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={submit} disabled={isPending}>
          Skip for now
        </Button>
        <Button variant="primary" onClick={submit} loading={isPending}>
          Save &amp; continue
        </Button>
      </div>
    </div>
  );
}
