import { createZodDto } from 'nestjs-zod';

import { userIndexQuerySchema } from '@nbw/validation';

export class UserIndexQueryDto extends createZodDto(userIndexQuerySchema) {}
export { userIndexQuerySchema };
