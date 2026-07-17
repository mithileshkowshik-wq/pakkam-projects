export type Availability = 'CASUAL' | 'PART_TIME' | 'SERIOUS' | 'BROWSING';
export type ProjectStage = 'IDEA' | 'PROTOTYPE' | 'IN_PROGRESS' | 'NEAR_LAUNCH';
export type CommitmentLevel = 'CASUAL' | 'PART_TIME' | 'SERIOUS';

export interface Skill { id: string; name: string; category?: string; }
export interface Domain { id: string; name: string; emoji?: string; }

export interface User {
  id: string;
  username: string;
  name: string;
  headline?: string; // MOCK-ONLY field, not yet in the real backend schema
  bio?: string;
  avatarUrl?: string;
  location?: string;
  availabilityLevel: Availability;
  openToCollaborate: boolean;
  skills: Skill[];
  domains: Domain[];
}

export interface ProjectRole { id: string; title: string; description?: string; }
export interface ProjectLink { id: string; label: string; url: string; }
export interface ProjectUpdate { id: string; content: string; createdAt: string; }

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  pitch: string;
  description: string; // sanitized HTML (Tiptap: p/strong/em/ul/li only) — see lib/sanitizeHtml.ts
  stage: ProjectStage;
  commitmentLevel: CommitmentLevel;
  collaborationStyle: string[];
  tools: string[];
  isOpenToCollabs: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  skills: Skill[];
  domains: Domain[]; // UI uses domains[0] as the single "category" chip
  roles: ProjectRole[];
  links: ProjectLink[];
  updates: ProjectUpdate[];
  owner: Pick<User, 'id'|'username'|'name'|'avatarUrl'|'headline'>;
  viewingCount?: number;
}
