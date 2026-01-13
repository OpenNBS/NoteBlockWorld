import { z } from 'zod';

import { songPreviewDtoSchema } from './SongPreview.dto';

export const songPageDtoSchema = z.object({
  content: z.array(songPreviewDtoSchema),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
});

export type SongPageDto = z.infer<typeof songPageDtoSchema>;
