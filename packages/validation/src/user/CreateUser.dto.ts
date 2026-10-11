import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email().max(64).min(1),
  username: z.string().max(64).min(1),
  profileImage: z.string().url(),
});

export type CreateUser = z.infer<typeof createUserSchema>;
