import { z } from 'zod';

// Mirrors the soft caps already enforced client-side in hooks/usePostProjectForm.ts —
// this is the hard server-side enforcement layer now that writes are real.
export const createProjectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(80, 'Title must be 80 characters or fewer.'),
  pitch: z.string().trim().min(1, 'Pitch is required.').max(120, 'Pitch must be 120 characters or fewer.'),
  categoryDomainId: z.string().trim().min(1, 'Pick a category.'),
  stage: z.enum(['IDEA', 'PROTOTYPE', 'IN_PROGRESS', 'NEAR_LAUNCH']),
  description: z.string().trim().min(1, 'Description is required.'),
  roles: z
    .array(z.object({ title: z.string().trim().min(1), description: z.string().trim().optional() }))
    .max(5, 'Up to 5 roles.'),
  skillsNeeded: z.array(z.string()).max(10, 'Up to 10 skills.'),
  commitment: z.enum(['CASUAL', 'PART_TIME', 'SERIOUS']),
  collaborationStyle: z.array(z.string()),
  tools: z.array(z.string()),
  demoLink: z.string().trim().optional(),
  githubLink: z.string().trim().optional(),
  openToCollaborators: z.boolean(),
  whoCanApply: z.enum(['ANYONE', 'INVITE_ONLY']),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
