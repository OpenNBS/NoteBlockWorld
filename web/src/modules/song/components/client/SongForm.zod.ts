import { UploadConst } from '@shared/validation/song/constants';
import { z as zod } from 'zod';

export const thumbnailDataSchema = zod.object({
  zoomLevel: zod.number().int().min(1).max(5),
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
    .max(64, {
      message: 'Title must be less than 64 characters',
    })
    .min(1, {
      message: 'Title is required',
    }),
  originalAuthor: zod
    .string()
    .max(64, {
      message: 'Original author must be less than 64 characters',
    })
    .min(0),
  author: zod.string(),
  description: zod.string().max(1024, {
    message: 'Description must be less than 1024 characters',
  }),
  thumbnailData: thumbnailDataSchema,
  customInstruments: zod.array(zod.string()),
  license: zod
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .enum(licenses)
    .refine((value) => Object.keys(UploadConst.licenses).includes(value), {
      message:
        // TODO: outdated message
        "Invalid license. Must be one of 'No license', 'CC BY 4.0', 'Public domain'",
    })
    .default('no_license'),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  category: zod.enum(categories).optional(),
});

export const uploadSongFormSchema = SongFormSchema.extend({});

export const editSongFormSchema = SongFormSchema.extend({
  id: zod.string(),
});

export type ThumbnailDataForm = zod.infer<typeof thumbnailDataSchema>;

export type UploadSongForm = zod.infer<typeof uploadSongFormSchema>;

export type EditSongForm = zod.infer<typeof editSongFormSchema>;
