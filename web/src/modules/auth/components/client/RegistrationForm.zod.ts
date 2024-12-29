import { z as zod } from 'zod';

export const RegistrationFormSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  username: zod.string(),
});

export type RegistrationFormType = zod.infer<typeof RegistrationFormSchema>;
