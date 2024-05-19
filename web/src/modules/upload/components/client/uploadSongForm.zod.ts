import { z as zod } from 'zod';

export const coverDataSchema = zod.object({
  zoomLevel: zod.number().int().min(1).max(5),
  startTick: zod.number().int().min(0),
  startLayer: zod.number().int().min(0),
  backgroundColor: zod.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const SongFormSchema = zod.object({
  allowDownload: zod.boolean().default(false),
  visibility: zod
    .union([zod.literal('public'), zod.literal('private')])
    .default('public'),
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
  artist: zod.string().min(0),
  description: zod.string().max(1024, {
    message: 'Description must be less than 1024 characters',
  }),
  coverData: coverDataSchema,
  customInstruments: zod.array(zod.string()),
  license: zod
    .union([
      zod.literal('no_license'),
      zod.literal('cc_by_4'),
      zod.literal('public_domain'),
    ])
    .refine(
      (value) => ['no_license', 'cc_by_4', 'public_domain'].includes(value),
      {
        message:
          "Invalid license. Must be one of 'No license', 'CC BY 4.0', 'Public domain'",
      },
    )
    .default('no_license'),
  category: zod
    .union([
      zod.literal('Gaming'),
      zod.literal('MoviesNTV'),
      zod.literal('Anime'),
      zod.literal('Vocaloid'),
      zod.literal('Rock'),
      zod.literal('Pop'),
      zod.literal('Electronic'),
      zod.literal('Ambient'),
      zod.literal('Jazz'),
      zod.literal('Classical'),
    ])
    .optional(),
});

export const uploadSongFormSchema = SongFormSchema.extend({});

export const editSongFormSchema = SongFormSchema.extend({
  id: zod.string(),
});

export type CoverData = zod.infer<typeof coverDataSchema>;

export type UploadSongForm = zod.infer<typeof uploadSongFormSchema>;

export type EditSongForm = zod.infer<typeof editSongFormSchema>;
