import { createZodDto } from 'nestjs-zod';

import { songListQueryDTOSchema } from '@nbw/validation';

export class SongListQueryDto extends createZodDto(songListQueryDTOSchema) {}
