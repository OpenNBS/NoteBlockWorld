import { createZodDto } from 'nestjs-zod';

import { songFileQueryDTOSchema } from '@nbw/validation';

export class SongFileQueryDto extends createZodDto(songFileQueryDTOSchema) {}
