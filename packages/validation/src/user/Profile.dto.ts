import { USER_CONSTANTS } from '@nbw/config';
import { z } from 'zod';

const PROFILE_DESCRIPTION_MAX = 20_000;

/** Path segment for `/profile/u/:username` — matches stored usernames (no spaces / special chars). */
export const profileUsernameParamSchema = z.object({
  username: z
    .string()
    .min(USER_CONSTANTS.USERNAME_MIN_LENGTH)
    .max(USER_CONSTANTS.USERNAME_MAX_LENGTH)
    .regex(USER_CONSTANTS.ALLOWED_REGEXP),
});

export type ProfileUsernameParam = z.infer<typeof profileUsernameParamSchema>;

const optionalLink = z.string().max(2048).optional();

export const socialLinksSchema = z
  .object({
    bandcamp: optionalLink,
    discord: optionalLink,
    facebook: optionalLink,
    github: optionalLink,
    instagram: optionalLink,
    reddit: optionalLink,
    snapchat: optionalLink,
    soundcloud: optionalLink,
    spotify: optionalLink,
    steam: optionalLink,
    telegram: optionalLink,
    tiktok: optionalLink,
    threads: optionalLink,
    twitch: optionalLink,
    x: optionalLink,
    youtube: optionalLink,
  })
  .strict()
  .partial();

export type SocialLinksInput = z.infer<typeof socialLinksSchema>;

const PUBLIC_NAME_MAX = 100;

export const patchProfileBodySchema = z
  .object({
    description: z.string().max(PROFILE_DESCRIPTION_MAX).optional(),
    socialLinks: socialLinksSchema.optional(),
    publicName: z.string().trim().min(1).max(PUBLIC_NAME_MAX).optional(),
  })
  .strict();

export type PatchProfileBody = z.infer<typeof patchProfileBodySchema>;

export const publicProfileDtoSchema = z.object({
  id: z.string(),
  username: z.string(),
  publicName: z.string(),
  profileImage: z.string(),
  description: z.string(),
  socialLinks: socialLinksSchema,
});

export type PublicProfileDto = z.infer<typeof publicProfileDtoSchema>;
