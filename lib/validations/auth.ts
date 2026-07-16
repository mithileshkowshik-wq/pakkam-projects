import { z } from 'zod';

// username becomes part of a public URL (/profile/[username]), so restrict to URL-safe chars.
export const USERNAME_REGEX = /^[a-z0-9-]+$/;

export const signupSchema = z.object({
  email: z.email('Enter a valid email address.'),
  // Supabase's default minimum password length is 6.
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  name: z.string().trim().min(1, 'Name is required.'),
  username: z
    .string()
    .trim()
    .min(1, 'Username is required.')
    .regex(USERNAME_REGEX, 'Use lowercase letters, numbers, and hyphens only.'),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Flattens a ZodError to a { field: firstMessage } map for inline field errors. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !out[key]) out[key] = issue.message;
  }
  return out;
}
