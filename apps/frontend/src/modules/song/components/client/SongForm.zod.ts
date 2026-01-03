import { z as zod } from 'zod';

import { THUMBNAIL_CONSTANTS, UPLOAD_CONSTANTS } from '@nbw/config';

export const thumbnailDataSchema = zod.object({
  zoomLevel: zod
    .number()
    .int()
    .min(THUMBNAIL_CONSTANTS.zoomLevel.min)
    .max(THUMBNAIL_CONSTANTS.zoomLevel.max)
    .default(THUMBNAIL_CONSTANTS.zoomLevel.default),
  startTick: zod
    .number()
    .int()
    .min(0)
    .default(THUMBNAIL_CONSTANTS.startTick.default),
  startLayer: zod
    .number()
    .int()
    .min(0)
    .default(THUMBNAIL_CONSTANTS.startLayer.default),
  backgroundColor: zod
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default(THUMBNAIL_CONSTANTS.backgroundColor.default),
});

const visibility = Object.keys(UPLOAD_CONSTANTS.visibility) as Readonly<
  string[]
>;

const categories = Object.keys(UPLOAD_CONSTANTS.categories) as Readonly<
  string[]
>;

const licenses = Object.keys(UPLOAD_CONSTANTS.licenses) as Readonly<string[]>;

export const SongFormSchema = zod.object({
  allowDownload: zod.boolean().default(true),

  visibility: zod.enum(visibility).default('public'),
  title: zod
    .string()
    .max(UPLOAD_CONSTANTS.title.maxLength, {
      error: `Title must be shorter than ${UPLOAD_CONSTANTS.title.maxLength} characters`,
    })
    .min(1, {
      error: 'Title is required',
    }),
  originalAuthor: zod
    .string()
    .max(UPLOAD_CONSTANTS.originalAuthor.maxLength, {
      error: `Original author must be shorter than ${UPLOAD_CONSTANTS.originalAuthor.maxLength} characters`,
    })
    .min(0),
  author: zod.string().optional(),
  description: zod.string().max(UPLOAD_CONSTANTS.description.maxLength, {
    error: `Description must be less than ${UPLOAD_CONSTANTS.description.maxLength} characters`,
  }),
  thumbnailData: thumbnailDataSchema,
  customInstruments: zod.array(zod.string()).default([]),
  license: zod
    .enum(['none', ...licenses] as const)
    .refine((v) => v !== 'none', {
      message: 'Please select a license',
    })
    .default(UPLOAD_CONSTANTS.license.default),

  category: zod.enum(categories).default(UPLOAD_CONSTANTS.category.default),
});

export const uploadSongFormSchema = SongFormSchema.extend({});

export const editSongFormSchema = SongFormSchema.extend({
  id: zod.string(),
});

// forms
export type ThumbnailDataFormInput = zod.input<typeof thumbnailDataSchema>;
export type UploadSongFormInput = zod.input<typeof uploadSongFormSchema>;
export type EditSongFormInput = zod.input<typeof editSongFormSchema>;

// parsed data
export type ThumbnailDataFormOutput = zod.infer<typeof thumbnailDataSchema>;
export type UploadSongFormOutput = zod.output<typeof uploadSongFormSchema>;
export type EditSongFormOutput = zod.output<typeof editSongFormSchema>;
