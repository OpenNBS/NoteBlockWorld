import { z } from 'zod';

import { songPreviewDtoSchema } from './SongPreview.dto.js';

export const songPageDtoSchema = z.object({
  content: z.array(songPreviewDtoSchema),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
});

export type SongPageDto = z.infer<typeof songPageDtoSchema>;

/** Client-side cache of loaded pages keyed by page number. */
export type SongsFolder = Record<number, SongPageDto>;
