import type { Project, User } from '@/lib/mock/types';

/** |intersection by id| between two skill/domain arrays. */
function overlapCount(a: { id: string }[], b: { id: string }[]): number {
  const bIds = new Set(b.map((item) => item.id));
  return a.filter((item) => bIds.has(item.id)).length;
}

// Weights adapted from the original architecture spec's scoreProject formula
// (skillOverlap*3 + domainOverlap*2 + availabilityMatch?2:0). No formula was specified for
// people-suggestions, so the same weights are reused for an analogous shared-skill/domain score.
const SKILL_WEIGHT = 3;
const DOMAIN_WEIGHT = 2;
const AVAILABILITY_WEIGHT = 2;

export function scoreProjectMatch(
  currentUser: Pick<User, 'skills' | 'domains' | 'availabilityLevel'>,
  project: Pick<Project, 'skills' | 'domains' | 'commitmentLevel'>,
): number {
  let score = overlapCount(project.skills, currentUser.skills) * SKILL_WEIGHT;
  score += overlapCount(project.domains, currentUser.domains) * DOMAIN_WEIGHT;
  // BROWSING has no CommitmentLevel counterpart, so it never earns the bonus — correct: a
  // browsing user hasn't signalled a commitment level a project could actually match.
  if ((currentUser.availabilityLevel as string) === project.commitmentLevel) score += AVAILABILITY_WEIGHT;
  return score;
}

export function scorePersonMatch(
  currentUser: Pick<User, 'skills' | 'domains' | 'availabilityLevel'>,
  candidate: Pick<User, 'skills' | 'domains' | 'availabilityLevel'>,
): number {
  let score = overlapCount(candidate.skills, currentUser.skills) * SKILL_WEIGHT;
  score += overlapCount(candidate.domains, currentUser.domains) * DOMAIN_WEIGHT;
  if (currentUser.availabilityLevel === candidate.availabilityLevel) score += AVAILABILITY_WEIGHT;
  return score;
}

/** Stable sort (Array.prototype.sort is stable per spec) so equal scores keep their incoming
 * order — callers pass an already-recency-ordered candidate pool, so ties break by recency. */
export function rankByScore<T>(items: T[], score: (item: T) => number, limit: number): T[] {
  return [...items].sort((a, b) => score(b) - score(a)).slice(0, limit);
}
