import { z } from 'zod';

import { songStatsSchema } from './SongStats';
import type { CategoryType, LicenseType, VisibilityType } from './types';

export const songViewUploaderSchema = z.object({
  username: z.string(),
  profileImage: z.string(),
});

export type SongViewUploader = z.infer<typeof songViewUploaderSchema>;

export const songViewDtoSchema = z.object({
  publicId: z.string().min(1),
  createdAt: z.date(),
  uploader: songViewUploaderSchema,
  thumbnailUrl: z.string().url(),
  playCount: z.number().int().min(0),
  downloadCount: z.number().int().min(0),
  likeCount: z.number().int().min(0),
  allowDownload: z.boolean(),
  title: z.string().min(1),
  originalAuthor: z.string(),
  description: z.string(),
  visibility: z.string() as z.ZodType<VisibilityType>,
  category: z.string() as z.ZodType<CategoryType>,
  license: z.string() as z.ZodType<LicenseType>,
  customInstruments: z.array(z.string()),
  fileSize: z.number().int().min(0),
  stats: songStatsSchema,
});

export type SongViewDto = z.infer<typeof songViewDtoSchema>;
