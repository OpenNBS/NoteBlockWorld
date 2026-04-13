import { createZodDto } from 'nestjs-zod';

import { songSearchQueryDTOSchema } from '@nbw/validation';

export class SongSearchQueryDto extends createZodDto(
  songSearchQueryDTOSchema,
) {}
