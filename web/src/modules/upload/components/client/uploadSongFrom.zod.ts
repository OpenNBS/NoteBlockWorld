import { z as zod } from 'zod';

const coverDataSchema = zod.object({
  zoomLevel: zod.number().int().min(1).max(5),
  startTick: zod.number().int().min(0),
  startLayer: zod.number().int().min(0),
  backgroundColor: zod.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const uploadSongFormSchema = zod.object({
  allowDownload: zod.boolean(),
  visibility: zod.union([zod.literal('public'), zod.literal('private')]),
  title: zod
    .string()
    .max(64, {
      message: 'Title must be less than 64 characters',
    })
    .min(1, {
      message: 'Title must be at least 1 character',
    }),
  originalAuthor: zod
    .string()
    .max(64, {
      message: 'Original author must be less than 64 characters',
    })
    .min(0),
  description: zod.string().max(1024, {
    message: 'Description must be less than 1024 characters',
  }),
  coverData: coverDataSchema,
  customInstruments: zod.array(zod.string()),
  license: zod.union([
    zod.literal('no_license'),
    zod.literal('cc_by_4'),
    zod.literal('public_domain'),
  ]),
  category: zod.union([
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
  ]),
});
