import { z } from 'zod';

import { SongOrderType, SongSortType } from './SongListQuery.dto.js';

export const songSearchParamsSchema = z.object({
  q: z.string().optional(),
  sort: z.enum(SongSortType).optional(),
  order: z.enum(SongOrderType).optional(),
  category: z.string().optional(),
  uploader: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  noteCountMin: z.number().int().min(0).optional(),
  noteCountMax: z.number().int().min(0).optional(),
  durationMin: z.number().int().min(0).optional(),
  durationMax: z.number().int().min(0).optional(),
  features: z.string().optional(),
  instruments: z.string().optional(),
});

export type SongSearchParams = z.input<typeof songSearchParamsSchema>;
