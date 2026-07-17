import { z } from 'zod';

export const COLLAB_REQUEST_MAX_LENGTH = 2000;

export const collabRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Tell the owner why you want to join')
    .max(COLLAB_REQUEST_MAX_LENGTH, 'Message is too long'),
});

export type CollabRequestInput = z.infer<typeof collabRequestSchema>;
