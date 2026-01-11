import { z } from 'zod';

import { UPLOAD_CONSTANTS } from '@nbw/config';

import { thumbnailDataSchema } from './ThumbnailData.dto';
import type { CategoryType, LicenseType, VisibilityType } from './types';

const visibility = Object.keys(UPLOAD_CONSTANTS.visibility) as Readonly<
  string[]
>;

const categories = Object.keys(UPLOAD_CONSTANTS.categories) as Readonly<
  string[]
>;

const licenses = Object.keys(UPLOAD_CONSTANTS.licenses) as Readonly<string[]>;

// Note: file field is not validated by zod as it's handled by multer/file upload middleware
export const uploadSongDtoSchema = z.object({
  file: z.any(), // Express.Multer.File - handled by upload middleware
  allowDownload: z
    .union([z.boolean(), z.string().transform((val) => val === 'true')])
    .pipe(z.boolean()),
  visibility: z.enum(
    visibility as [string, ...string[]],
  ) as z.ZodType<VisibilityType>,
  title: z.string().min(1).max(UPLOAD_CONSTANTS.title.maxLength),
  originalAuthor: z.string().max(UPLOAD_CONSTANTS.originalAuthor.maxLength),
  description: z.string().max(UPLOAD_CONSTANTS.description.maxLength),
  category: z.enum(
    categories as [string, ...string[]],
  ) as z.ZodType<CategoryType>,
  thumbnailData: z
    .union([
      thumbnailDataSchema,
      z
        .string()
        .transform((val) => JSON.parse(val))
        .pipe(thumbnailDataSchema),
    ])
    .pipe(thumbnailDataSchema),
  license: z.enum(licenses as [string, ...string[]]) as z.ZodType<LicenseType>,
  customInstruments: z
    .union([
      z.array(z.string()),
      z
        .string()
        .transform((val) => JSON.parse(val))
        .pipe(z.array(z.string())),
    ])
    .pipe(z.array(z.string()).max(UPLOAD_CONSTANTS.customInstruments.maxCount)),
});

export type UploadSongDto = z.infer<typeof uploadSongDtoSchema>;
