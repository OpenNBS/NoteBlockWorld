import { z } from 'zod';

export enum SongSortType {
  RECENT = 'recent',
  RANDOM = 'random',
  PLAY_COUNT = 'playCount',
  TITLE = 'title',
  DURATION = 'duration',
  NOTE_COUNT = 'noteCount',
}

export enum SongOrderType {
  ASC = 'asc',
  DESC = 'desc',
}

export const songListQueryDTOSchema = z.object({
  q: z.string().optional(),
  sort: z.nativeEnum(SongSortType).optional().default(SongSortType.RECENT),
  order: z.nativeEnum(SongOrderType).optional().default(SongOrderType.DESC),
  category: z.string().optional(),
  uploader: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
});

export type SongListQueryDTO = z.infer<typeof songListQueryDTOSchema>;
