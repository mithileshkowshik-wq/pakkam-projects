import { z } from 'zod';

export const MESSAGE_MAX_LENGTH = 4000;

export const messageSchema = z.object({
  content: z.string().trim().min(1, 'Message cannot be empty').max(MESSAGE_MAX_LENGTH, 'Message is too long'),
});

export type MessageInput = z.infer<typeof messageSchema>;
