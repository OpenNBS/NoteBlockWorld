import { z } from 'zod';

import { songPreviewDtoSchema } from './SongPreview.dto';

export const featuredSongsDtoSchema = z.object({
  hour: z.array(songPreviewDtoSchema),
  day: z.array(songPreviewDtoSchema),
  week: z.array(songPreviewDtoSchema),
  month: z.array(songPreviewDtoSchema),
  year: z.array(songPreviewDtoSchema),
  all: z.array(songPreviewDtoSchema),
});

export type FeaturedSongsDto = z.infer<typeof featuredSongsDtoSchema>;

export const createFeaturedSongsDto = (): FeaturedSongsDto => {
  return {
    hour: [],
    day: [],
    week: [],
    month: [],
    year: [],
    all: [],
  };
};
