import { z } from 'zod';

import { UPLOAD_CONSTANTS } from '@nbw/config';

import type { VisibilityType } from './uploadMeta';

const songPreviewUploaderSchema = z.object({
  username: z.string(),
  profileImage: z.string(),
});

export const songPreviewDtoSchema = z.object({
  publicId: z.string().min(1),
  uploader: songPreviewUploaderSchema,
  title: z.string().min(1).max(UPLOAD_CONSTANTS.title.maxLength),
  description: z.string().max(UPLOAD_CONSTANTS.description.maxLength),
  originalAuthor: z.string().max(UPLOAD_CONSTANTS.originalAuthor.maxLength),
  duration: z.number().min(0),
  noteCount: z.number().int().min(0),
  thumbnailUrl: z.url(),
  createdAt: z.date(),
  updatedAt: z.date(),
  playCount: z.number().int().min(0),
  visibility: z.string() as z.ZodType<VisibilityType>,
});

export type SongPreviewDto = z.infer<typeof songPreviewDtoSchema>;
