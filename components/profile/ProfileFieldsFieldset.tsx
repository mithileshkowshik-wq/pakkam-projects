'use client';

import { AVAILABILITY_LABEL } from '@/lib/constants';
import type { Domain, Skill } from '@/lib/data';
import {
  BIO_MAX,
  MAX_DOMAINS,
  MAX_SKILLS,
  type ProfileFieldsState,
  useProfileFieldsForm,
} from '@/hooks/useProfileFieldsForm';
import { CharCounter, Chip, Input, RadioCard, TagPicker, Textarea } from '@/components/ui';

const AVAILABILITY_OPTIONS = (['CASUAL', 'PART_TIME', 'SERIOUS', 'BROWSING'] as const).map((value) => ({
  value,
  label: AVAILABILITY_LABEL[value],
}));

export interface ProfileFieldsFieldsetProps {
  state: ProfileFieldsState;
  form: ReturnType<typeof useProfileFieldsForm>;
  skills: Skill[];
  domains: Domain[];
  /** Onboarding never collects headline (it wasn't part of that flow) — only Edit Profile does. */
  includeHeadline?: boolean;
}

export function ProfileFieldsFieldset({ state, form, skills, domains, includeHeadline }: ProfileFieldsFieldsetProps) {
  return (
    <div className="flex flex-col gap-5">
      {includeHeadline && (
        <div className="flex flex-col gap-2">
          <label htmlFor="headline" className="text-sm font-semibold text-ink">
            Headline
          </label>
          <Input
            id="headline"
            value={state.headline}
            onChange={(e) => form.setHeadline(e.target.value)}
            placeholder="Game designer · Berlin, DE"
          />
        </div>
      )}

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
                    selected ? state.domainIds.filter((id) => id !== domain.id) : [...state.domainIds, domain.id],
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
  );
}
