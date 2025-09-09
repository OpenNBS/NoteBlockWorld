import { THUMBNAIL_CONSTANTS, UPLOAD_CONSTANTS } from '@nbw/config';
import { z as zod } from 'zod';

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

  // @ts-ignore
  visibility: zod.enum(visibility).default('public'),
  title: zod
    .string()
    .max(UPLOAD_CONSTANTS.title.maxLength, {
      message: `Title must be shorter than ${UPLOAD_CONSTANTS.title.maxLength} characters`,
    })
    .min(1, {
      message: 'Title is required',
    }),
  originalAuthor: zod
    .string()
    .max(UPLOAD_CONSTANTS.originalAuthor.maxLength, {
      message: `Original author must be shorter than ${UPLOAD_CONSTANTS.originalAuthor.maxLength} characters`,
    })
    .min(0),
  author: zod.string().optional(),
  description: zod.string().max(UPLOAD_CONSTANTS.description.maxLength, {
    message: `Description must be less than ${UPLOAD_CONSTANTS.description.maxLength} characters`,
  }),
  thumbnailData: thumbnailDataSchema,
  customInstruments: zod.array(zod.string()),
  license: zod

    // @ts-ignore
    .enum(licenses, {
      message: 'Please select a license',
    })
    .refine((value) => Object.keys(UPLOAD_CONSTANTS.licenses).includes(value))
    .default(UPLOAD_CONSTANTS.license.default),

  // @ts-ignore
  category: zod.enum(categories).default(UPLOAD_CONSTANTS.CATEGORY_DEFAULT),
});

export const uploadSongFormSchema = SongFormSchema.extend({});

export const editSongFormSchema = SongFormSchema.extend({
  id: zod.string(),
});

export type ThumbnailDataForm = zod.infer<typeof thumbnailDataSchema>;

export type UploadSongForm = zod.infer<typeof uploadSongFormSchema>;

export type EditSongForm = zod.infer<typeof editSongFormSchema>;
