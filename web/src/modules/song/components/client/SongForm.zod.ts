import { ThumbnailConst, UploadConst } from '@shared/validation/song/constants';
import { z as zod } from 'zod';

export const thumbnailDataSchema = zod.object({
  zoomLevel: zod
    .number()
    .int()
    .min(ThumbnailConst.ZOOM_LEVEL_MIN)
    .max(ThumbnailConst.ZOOM_LEVEL_MAX)
    .default(ThumbnailConst.ZOOM_LEVEL_DEFAULT),
  startTick: zod.number().int().min(0),
  startLayer: zod.number().int().min(0),
  backgroundColor: zod.string().regex(/^#[0-9a-fA-F]{6}$/),
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
    .max(UploadConst.SONG_TITLE_MAX_LENGTH, {
      message: `Title must be shorter than ${UploadConst.SONG_TITLE_MAX_LENGTH} characters`,
    })
    .min(1, {
      message: 'Title is required',
    }),
  originalAuthor: zod
    .string()
    .max(UploadConst.SONG_ORIGINAL_AUTHOR_MAX_LENGTH, {
      message: `Original author must be shorter than ${UploadConst.SONG_ORIGINAL_AUTHOR_MAX_LENGTH} characters`,
    })
    .min(0),
  author: zod.string().optional(),
  description: zod.string().max(UploadConst.SONG_DESCRIPTION_MAX_LENGTH, {
    message: `Description must be less than ${UploadConst.SONG_DESCRIPTION_MAX_LENGTH} characters`,
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
    .default(UploadConst.LICENSE_DEFAULT),
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
