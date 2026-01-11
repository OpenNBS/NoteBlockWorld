import { z } from 'zod';

export const customInstrumentDataSchema = z.object({
  sound: z.array(z.string()).min(1),
});

export type CustomInstrumentData = z.infer<typeof customInstrumentDataSchema>;
