import { z } from 'zod';

import { THUMBNAIL_CONSTANTS } from '@nbw/config';

export const thumbnailDataSchema = z.object({
  zoomLevel: z
    .number()
    .int()
    .min(THUMBNAIL_CONSTANTS.zoomLevel.min)
    .max(THUMBNAIL_CONSTANTS.zoomLevel.max),
  startTick: z.number().int().min(0),
  startLayer: z.number().int().min(0),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export type ThumbnailData = z.infer<typeof thumbnailDataSchema>;

export const getThumbnailDataExample = (): ThumbnailData => {
  return {
    zoomLevel: 3,
    startTick: 0,
    startLayer: 0,
    backgroundColor: '#F0F0F0',
  };
};
