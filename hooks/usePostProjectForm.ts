'use client';

import { useEffect, useReducer } from 'react';

import type { CommitmentLevel, ProjectStage } from '@/lib/mock/types';

export interface RoleDraft {
  id: string;
  title: string;
  description: string;
}

export type WhoCanApply = 'ANYONE' | 'INVITE_ONLY';

export interface PostProjectState {
  title: string; // max 80
  pitch: string; // max 120
  categoryDomainId: string; // single-select from DOMAINS
  stage: ProjectStage;
  description: string; // free text
  roles: RoleDraft[]; // max 5
  skillsNeeded: string[]; // skill IDs, max 10
  commitment: CommitmentLevel;
  collaborationStyle: string[]; // multi-select
  tools: string[]; // multi-select
  demoLink: string;
  githubLink: string;
  openToCollaborators: boolean;
  whoCanApply: WhoCanApply;
  draftSavedAt: Date | null;
}

export const MAX_ROLES = 5;
export const MAX_SKILLS = 10;
export const TITLE_MAX = 80;
export const PITCH_MAX = 120;

const initialState: PostProjectState = {
  title: '',
  pitch: '',
  categoryDomainId: '',
  stage: 'IDEA',
  description: '',
  roles: [],
  skillsNeeded: [],
  commitment: 'CASUAL',
  collaborationStyle: [],
  tools: [],
  demoLink: '',
  githubLink: '',
  openToCollaborators: true,
  whoCanApply: 'ANYONE',
  draftSavedAt: null,
};

type Action =
  | { type: 'SET_FIELD'; key: keyof PostProjectState; value: PostProjectState[keyof PostProjectState] }
  | { type: 'ADD_ROLE' }
  | { type: 'REMOVE_ROLE'; id: string }
  | { type: 'UPDATE_ROLE'; id: string; patch: Partial<Omit<RoleDraft, 'id'>> }
  | { type: 'TOGGLE_IN_ARRAY'; key: 'collaborationStyle' | 'tools'; value: string }
  | { type: 'MARK_DRAFT_SAVED' };

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function reducer(state: PostProjectState, action: Action): PostProjectState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.key]: action.value };
    case 'ADD_ROLE':
      if (state.roles.length >= MAX_ROLES) return state;
      return {
        ...state,
        roles: [
          ...state.roles,
          { id: `role-${Date.now()}-${state.roles.length}`, title: '', description: '' },
        ],
      };
    case 'REMOVE_ROLE':
      return { ...state, roles: state.roles.filter((r) => r.id !== action.id) };
    case 'UPDATE_ROLE':
      return {
        ...state,
        roles: state.roles.map((r) => (r.id === action.id ? { ...r, ...action.patch } : r)),
      };
    case 'TOGGLE_IN_ARRAY':
      return { ...state, [action.key]: toggle(state[action.key], action.value) };
    case 'MARK_DRAFT_SAVED':
      return { ...state, draftSavedAt: new Date() };
    default:
      return state;
  }
}

export function usePostProjectForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setField = <K extends keyof PostProjectState>(key: K, value: PostProjectState[K]) =>
    dispatch({ type: 'SET_FIELD', key, value });

  const markDraftSaved = () => dispatch({ type: 'MARK_DRAFT_SAVED' });

  // Debounced autosave: ~1.5s after the last edit, stamp draftSavedAt. The dependency list
  // covers every user-editable field so any change restarts the timer. draftSavedAt itself is
  // deliberately excluded to avoid a self-retriggering loop.
  useEffect(() => {
    const timer = setTimeout(markDraftSaved, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.title,
    state.pitch,
    state.categoryDomainId,
    state.stage,
    state.description,
    state.roles,
    state.skillsNeeded,
    state.commitment,
    state.collaborationStyle,
    state.tools,
    state.demoLink,
    state.githubLink,
    state.openToCollaborators,
    state.whoCanApply,
  ]);

  return {
    state,
    setTitle: (v: string) => setField('title', v),
    setPitch: (v: string) => setField('pitch', v),
    setCategory: (v: string) => setField('categoryDomainId', v),
    setStage: (v: ProjectStage) => setField('stage', v),
    setDescription: (v: string) => setField('description', v),
    addRole: () => dispatch({ type: 'ADD_ROLE' }),
    removeRole: (id: string) => dispatch({ type: 'REMOVE_ROLE', id }),
    updateRole: (id: string, patch: Partial<Omit<RoleDraft, 'id'>>) =>
      dispatch({ type: 'UPDATE_ROLE', id, patch }),
    setSkillsNeeded: (v: string[]) => setField('skillsNeeded', v),
    setCommitment: (v: CommitmentLevel) => setField('commitment', v),
    toggleCollaborationStyle: (v: string) =>
      dispatch({ type: 'TOGGLE_IN_ARRAY', key: 'collaborationStyle', value: v }),
    toggleTool: (v: string) => dispatch({ type: 'TOGGLE_IN_ARRAY', key: 'tools', value: v }),
    setDemoLink: (v: string) => setField('demoLink', v),
    setGithubLink: (v: string) => setField('githubLink', v),
    setOpenToCollaborators: (v: boolean) => setField('openToCollaborators', v),
    setWhoCanApply: (v: WhoCanApply) => setField('whoCanApply', v),
    markDraftSaved,
  };
}
