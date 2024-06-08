import { ThumbnailConst, UploadConst } from '@shared/validation/song/constants';
import { z as zod } from 'zod';

export const thumbnailDataSchema = zod.object({
  zoomLevel: zod
    .number()
    .int()
    .min(ThumbnailConst.zoomLevel.min)
    .max(ThumbnailConst.zoomLevel.max)
    .default(ThumbnailConst.zoomLevel.default),
  startTick: zod
    .number()
    .int()
    .min(0)
    .default(ThumbnailConst.startTick.default),
  startLayer: zod
    .number()
    .int()
    .min(0)
    .default(ThumbnailConst.startLayer.default),
  backgroundColor: zod
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default(ThumbnailConst.backgroundColor.default),
});

const visibility = Object.keys(UploadConst.visibility) as Readonly<string[]>;
const categories = Object.keys(UploadConst.categories) as Readonly<string[]>;
const licenses = Object.keys(UploadConst.licenses) as Readonly<string[]>;

export const SongFormSchema = zod.object({
  allowDownload: zod.boolean().default(true),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  visibility: zod.enum(visibility).default('public'),
  title: zod
    .string()
    .max(UploadConst.title.maxLength, {
      message: `Title must be shorter than ${UploadConst.title.maxLength} characters`,
    })
    .min(1, {
      message: 'Title is required',
    }),
  originalAuthor: zod
    .string()
    .max(UploadConst.originalAuthor.maxLength, {
      message: `Original author must be shorter than ${UploadConst.originalAuthor.maxLength} characters`,
    })
    .min(0),
  author: zod.string().optional(),
  description: zod.string().max(UploadConst.description.maxLength, {
    message: `Description must be less than ${UploadConst.description.maxLength} characters`,
  }),
  thumbnailData: thumbnailDataSchema,
  customInstruments: zod.array(zod.string()),
  license: zod
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .enum(licenses)
    .refine((value) => Object.keys(UploadConst.licenses).includes(value), {
      message: 'Invalid license',
    })
    .default(UploadConst.license.default),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  category: zod.enum(categories).default(UploadConst.CATEGORY_DEFAULT),
});

export const uploadSongFormSchema = SongFormSchema.extend({});

export const editSongFormSchema = SongFormSchema.extend({
  id: zod.string(),
});

export type ThumbnailDataForm = zod.infer<typeof thumbnailDataSchema>;

export type UploadSongForm = zod.infer<typeof uploadSongFormSchema>;

export type EditSongForm = zod.infer<typeof editSongFormSchema>;
