import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const songIdParamSchema = z.object({
  id: z.string(),
});

export class SongIdParamDto extends createZodDto(songIdParamSchema) {}
