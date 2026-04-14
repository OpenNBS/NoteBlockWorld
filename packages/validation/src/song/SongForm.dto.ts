import { z } from 'zod';

import { THUMBNAIL_CONSTANTS, UPLOAD_CONSTANTS } from '../config-shim.js';

/** Form defaults for thumbnail editor (API uses strict `ThumbnailData.dto`). */
export const songFormThumbnailDataSchema = z.object({
  zoomLevel: z
    .number()
    .int()
    .min(THUMBNAIL_CONSTANTS.zoomLevel.min)
    .max(THUMBNAIL_CONSTANTS.zoomLevel.max)
    .default(THUMBNAIL_CONSTANTS.zoomLevel.default),
  startTick: z
    .number()
    .int()
    .min(0)
    .default(THUMBNAIL_CONSTANTS.startTick.default),
  startLayer: z
    .number()
    .int()
    .min(0)
    .default(THUMBNAIL_CONSTANTS.startLayer.default),
  backgroundColor: z
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

export const SongFormSchema = z.object({
  allowDownload: z.boolean().default(true),

  visibility: z.enum(visibility).default('public'),
  title: z
    .string()
    .max(UPLOAD_CONSTANTS.title.maxLength, {
      error: `Title must be shorter than ${UPLOAD_CONSTANTS.title.maxLength} characters`,
    })
    .min(1, {
      error: 'Title is required',
    }),
  originalAuthor: z
    .string()
    .max(UPLOAD_CONSTANTS.originalAuthor.maxLength, {
      error: `Original author must be shorter than ${UPLOAD_CONSTANTS.originalAuthor.maxLength} characters`,
    })
    .min(0),
  author: z.string().optional(),
  description: z.string().max(UPLOAD_CONSTANTS.description.maxLength, {
    error: `Description must be less than ${UPLOAD_CONSTANTS.description.maxLength} characters`,
  }),
  thumbnailData: songFormThumbnailDataSchema,
  customInstruments: z.array(z.string()).default([]),
  license: z
    .enum(['none', ...(licenses as [string, ...string[]])] as [
      string,
      ...string[],
    ])
    .refine((v) => v !== 'none', {
      message: 'Please select a license',
    })
    .default(UPLOAD_CONSTANTS.license.default),

  category: z.enum(categories).default(UPLOAD_CONSTANTS.category.default),
});

export const uploadSongFormSchema = SongFormSchema.extend({});

export const editSongFormSchema = SongFormSchema.extend({
  id: z.string(),
});

export type UploadSongFormInput = z.input<typeof uploadSongFormSchema>;
export type EditSongFormInput = z.input<typeof editSongFormSchema>;
export type UploadSongFormOutput = z.output<typeof uploadSongFormSchema>;
export type EditSongFormOutput = z.output<typeof editSongFormSchema>;
