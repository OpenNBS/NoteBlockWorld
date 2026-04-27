import { z } from 'zod';

export const loginWithEmailDtoSchema = z.object({
  email: z.string().email().min(1),
});

export type LoginWithEmailDto = z.infer<typeof loginWithEmailDtoSchema>;

/** @deprecated Use loginWithEmailDtoSchema */
export const loginDtoSchema = loginWithEmailDtoSchema;
/** @deprecated Use LoginWithEmailDto */
export type LoginDto = LoginWithEmailDto;
