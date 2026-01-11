import { z } from 'zod';

import type { VisibilityType } from './types';

const songPreviewUploaderSchema = z.object({
  username: z.string(),
  profileImage: z.string(),
});

export type SongPreviewUploader = z.infer<typeof songPreviewUploaderSchema>;

export const songPreviewDtoSchema = z.object({
  publicId: z.string().min(1),
  uploader: songPreviewUploaderSchema,
  title: z.string().min(1).max(128),
  description: z.string().min(1),
  originalAuthor: z.string().min(1).max(64),
  duration: z.number().min(0),
  noteCount: z.number().int().min(0),
  thumbnailUrl: z.string().url(),
  createdAt: z.date(),
  updatedAt: z.date(),
  playCount: z.number().int().min(0),
  visibility: z.string() as z.ZodType<VisibilityType>,
});

export type SongPreviewDto = z.infer<typeof songPreviewDtoSchema>;
