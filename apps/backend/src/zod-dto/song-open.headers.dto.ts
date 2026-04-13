import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/** Headers for `GET /song/:id/open` */
const songOpenHeadersSchema = z.object({
  src: z.string(),
});

export class SongOpenHeadersDto extends createZodDto(songOpenHeadersSchema) {}
