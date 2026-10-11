import { createZodDto } from 'nestjs-zod';

import { uploadSongDtoSchema } from '@nbw/validation';

export class UploadSongBodyDto extends createZodDto(uploadSongDtoSchema) {}
