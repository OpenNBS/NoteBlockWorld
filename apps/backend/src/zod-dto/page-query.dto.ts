import { createZodDto } from 'nestjs-zod';

import { pageQueryDTOSchema } from '@nbw/validation';

export class PageQueryDto extends createZodDto(pageQueryDTOSchema) {}
