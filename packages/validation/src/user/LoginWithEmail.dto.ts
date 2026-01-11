import { z } from 'zod';

export const loginWithEmailDtoSchema = z.object({
  email: z.string().email().min(1),
});

export type LoginWithEmailDto = z.infer<typeof loginWithEmailDtoSchema>;
