import { z } from 'zod';

export const userDtoSchema = z.object({
  username: z.string(),
  publicName: z.string(),
  email: z.string(),
});

export type UserDto = z.infer<typeof userDtoSchema>;
