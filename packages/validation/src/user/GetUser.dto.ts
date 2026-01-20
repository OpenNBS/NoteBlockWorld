import { z } from 'zod';

export const getUserSchema = z.object({
  email: z.string().email().max(64).optional(),
  username: z.string().max(64).optional(),
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .min(24)
    .max(24)
    .optional(),
});

export type GetUser = z.infer<typeof getUserSchema>;
