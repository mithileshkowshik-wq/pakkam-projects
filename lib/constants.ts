import type { Availability, CommitmentLevel, ProjectStage } from '@/lib/mock/types';

export const STAGE_BADGE: Record<ProjectStage, {variant:'idea'|'prog'|'launch'; label:string}> = {
  IDEA: {variant:'idea', label:'Just an Idea'},
  PROTOTYPE: {variant:'prog', label:'Early Prototype'},
  IN_PROGRESS: {variant:'prog', label:'In Progress'},
  NEAR_LAUNCH: {variant:'launch', label:'Nearing Launch'},
};
export const COMMITMENT_LABEL: Record<CommitmentLevel,string> = {
  CASUAL:'Casual', PART_TIME:'5–10 hrs/week', SERIOUS:'10+ hrs/week',
};
export const AVAILABILITY_LABEL: Record<Availability,string> = {
  CASUAL:'Available · a few hrs/week', PART_TIME:'Available · 5–10 hrs/week',
  SERIOUS:'Available · 10+ hrs/week', BROWSING:'Just browsing',
};
export const COLLAB_STYLE_ICON: Record<string, string> = {
  'Remote': 'globe', 'Async-friendly': 'clock', 'In-person': 'users',
  'Scheduled calls': 'calendar', 'Flexible': 'shuffle',
}; // values are lucide-react icon component names (as strings) the UI layer will map to actual icon components
