import { z } from 'zod';

export const newEmailUserDtoSchema = z.object({
  username: z.string().min(4).max(64),
  email: z.string().email().max(64).min(1),
});

export type NewEmailUserDto = z.infer<typeof newEmailUserDtoSchema>;
