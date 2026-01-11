import { z } from 'zod';

export const loginDtoSchema = z.object({
  email: z.string().email().min(1),
});

export type LoginDto = z.infer<typeof loginDtoSchema>;
