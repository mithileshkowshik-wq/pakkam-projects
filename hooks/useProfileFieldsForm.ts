'use client';

import { useReducer } from 'react';

import type { Availability } from '@/lib/data';

export interface ProfileFieldsState {
  headline: string; // only rendered/edited via ProfileFieldsFieldset's includeHeadline
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
  key: keyof ProfileFieldsState;
  value: ProfileFieldsState[keyof ProfileFieldsState];
};

function reducer(state: ProfileFieldsState, action: Action): ProfileFieldsState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
}

export function useProfileFieldsForm(initial: ProfileFieldsState) {
  const [state, dispatch] = useReducer(reducer, initial);

  const setField = <K extends keyof ProfileFieldsState>(key: K, value: ProfileFieldsState[K]) =>
    dispatch({ type: 'SET_FIELD', key, value });

  return {
    state,
    setHeadline: (v: string) => setField('headline', v),
    setBio: (v: string) => setField('bio', v),
    setAvailabilityLevel: (v: Availability) => setField('availabilityLevel', v),
    setLocation: (v: string) => setField('location', v),
    setSkillIds: (v: string[]) => setField('skillIds', v),
    setDomainIds: (v: string[]) => setField('domainIds', v),
  };
}
