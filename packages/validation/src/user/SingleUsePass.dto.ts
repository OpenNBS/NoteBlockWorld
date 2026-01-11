import { z } from 'zod';

export const singleUsePassDtoSchema = z.object({
  id: z.string().min(1),
  pass: z.string().min(1),
});

export type SingleUsePassDto = z.infer<typeof singleUsePassDtoSchema>;
