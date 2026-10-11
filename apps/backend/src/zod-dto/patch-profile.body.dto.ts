import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { patchProfileBodySchema } from '@nbw/validation';

/**
 * Re-declare `publicName` here so request validation always allows it even when the
 * running process resolves an older `@nbw/validation` build (strict object would
 * otherwise reject the key with `unrecognized_keys`).
 */
export const patchProfileBodyDtoSchema = patchProfileBodySchema
  .extend({
    publicName: z.string().trim().min(1).max(100).optional(),
  })
  .strict();

export class PatchProfileBodyDto extends createZodDto(
  patchProfileBodyDtoSchema,
) {}
