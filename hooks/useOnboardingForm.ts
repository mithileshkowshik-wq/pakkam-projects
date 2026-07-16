'use client';

import { useReducer } from 'react';

import type { Availability } from '@/lib/data';

export interface OnboardingState {
  bio: string; // soft limit 100
  availabilityLevel: Availability;
  location: string;
  skillIds: string[]; // max 15
  domainIds: string[]; // max 8
}

export const BIO_MAX = 100;
export const MAX_SKILLS = 15;
export const MAX_DOMAINS = 8;

type Action = {
  type: 'SET_FIELD';
  key: keyof OnboardingState;
  value: OnboardingState[keyof OnboardingState];
};

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
}

export function useOnboardingForm(initial: OnboardingState) {
  const [state, dispatch] = useReducer(reducer, initial);

  const setField = <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) =>
    dispatch({ type: 'SET_FIELD', key, value });

  return {
    state,
    setBio: (v: string) => setField('bio', v),
    setAvailabilityLevel: (v: Availability) => setField('availabilityLevel', v),
    setLocation: (v: string) => setField('location', v),
    setSkillIds: (v: string[]) => setField('skillIds', v),
    setDomainIds: (v: string[]) => setField('domainIds', v),
  };
}
