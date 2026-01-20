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
  firstCustomInstrumentIndex: z.number().int(),
  outOfRangeNoteCount: z.number().int(),
  detunedNoteCount: z.number().int(),
  customInstrumentNoteCount: z.number().int(),
  incompatibleNoteCount: z.number().int(),
  compatible: z.boolean(),
  instrumentNoteCounts: z.array(z.number().int()),
});

export type SongStats = z.infer<typeof songStatsSchema>;
