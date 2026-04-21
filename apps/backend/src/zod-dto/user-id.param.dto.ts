import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { isValidObjectId } from 'mongoose';

const userIdParamSchema = z.object({
  userId: z
    .string()
    .refine((id) => isValidObjectId(id), { message: 'Invalid user id' }),
});

export class UserIdParamDto extends createZodDto(userIdParamSchema) {}
