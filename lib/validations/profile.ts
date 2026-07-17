import { z } from 'zod';

export const profileEditSchema = z.object({
  headline: z.string().trim().max(120, 'Headline is too long.'),
  bio: z.string().trim().max(100, 'Bio must be 100 characters or fewer.'),
  location: z.string().trim().max(80, 'Location is too long.'),
  availabilityLevel: z.enum(['CASUAL', 'PART_TIME', 'SERIOUS', 'BROWSING']),
  skillIds: z.array(z.string()).max(15, 'Up to 15 skills.'),
  domainIds: z.array(z.string()).max(8, 'Up to 8 domains.'),
});

export type ProfileEditInput = z.infer<typeof profileEditSchema>;
