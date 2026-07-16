'use client';

import { useTransition } from 'react';

import { Button, CharCounter, Chip, H1, Input, RadioCard, Sub, TagPicker, Textarea } from '@/components/ui';
import type { Domain, Skill } from '@/lib/data';
import { AVAILABILITY_LABEL } from '@/lib/constants';
import { BIO_MAX, MAX_DOMAINS, MAX_SKILLS, useOnboardingForm } from '@/hooks/useOnboardingForm';

import { saveOnboarding } from './actions';

const AVAILABILITY_OPTIONS = (['CASUAL', 'PART_TIME', 'SERIOUS', 'BROWSING'] as const).map((value) => ({
  value,
  label: AVAILABILITY_LABEL[value],
}));

export function OnboardingForm({ skills, domains }: { skills: Skill[]; domains: Domain[] }) {
  const form = useOnboardingForm({
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

      <div className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="bio" className="text-sm font-semibold text-ink">
              Bio
            </label>
            <CharCounter count={state.bio.length} max={BIO_MAX} />
          </div>
          <Textarea
            id="bio"
            value={state.bio}
            onChange={(e) => form.setBio(e.target.value)}
            placeholder="What are you into building?"
            className="min-h-[80px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">Availability</span>
          <div role="radiogroup" aria-label="Availability" className="flex flex-col gap-2.5">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <RadioCard
                key={opt.value}
                label={opt.label}
                selected={state.availabilityLevel === opt.value}
                onSelect={() => form.setAvailabilityLevel(opt.value)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-sm font-semibold text-ink">
            Location
          </label>
          <Input
            id="location"
            value={state.location}
            onChange={(e) => form.setLocation(e.target.value)}
            placeholder="Berlin, DE"
          />
        </div>

        <TagPicker
          label="Skills"
          options={skills.map((s) => ({ id: s.id, name: s.name }))}
          selected={state.skillIds}
          onChange={form.setSkillIds}
          max={MAX_SKILLS}
          placeholder="Type to add a skill…"
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">Into</span>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => {
              const selected = state.domainIds.includes(domain.id);
              const atMax = !selected && state.domainIds.length >= MAX_DOMAINS;
              return (
                <Chip
                  key={domain.id}
                  variant={selected ? 'fill' : 'default'}
                  selected={selected}
                  onClick={() => {
                    if (atMax) return;
                    form.setDomainIds(
                      selected
                        ? state.domainIds.filter((id) => id !== domain.id)
                        : [...state.domainIds, domain.id],
                    );
                  }}
                >
                  {domain.emoji ? `${domain.emoji} ${domain.name}` : domain.name}
                </Chip>
              );
            })}
          </div>
        </div>
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
