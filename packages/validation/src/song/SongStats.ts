import { z } from 'zod';

export const songStatsSchema = z.object({
  midiFileName: z.string(),
  noteCount: z.number().int(),
  tickCount: z.number().int(),
  layerCount: z.number().int(),
  tempo: z.number(),
  tempoRange: z.array(z.number()).nullable(),
  timeSignature: z.number(),
  duration: z.number(),
  loop: z.boolean(),
  loopStartTick: z.number().int(),
  minutesSpent: z.number(),
  vanillaInstrumentCount: z.number().int(),
  customInstrumentCount: z.number().int(),
  firstCustomInstrumentIndex: z
    .number()
    .int()
    .refine((v) => v === 16 || v === 20, { message: 'Must be 16 or 20' }),
  nbsVersion: z
    .number()
    .int()
    .refine((v) => v === 5 || v === 6, { message: 'Must be 5 or 6' }),
  outOfRangeNoteCount: z.number().int(),
  detunedNoteCount: z.number().int(),
  customInstrumentNoteCount: z.number().int(),
  incompatibleNoteCount: z.number().int(),
  compatible: z.boolean(),
  instrumentNoteCounts: z.array(z.number().int()),
});

export type SongStats = z.infer<typeof songStatsSchema>;
