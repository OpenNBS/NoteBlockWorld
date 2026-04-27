import { createZodDto } from 'nestjs-zod';

import { updateUsernameDtoSchema } from '@nbw/validation';

export class UpdateUsernameBodyDto extends createZodDto(
  updateUsernameDtoSchema,
) {}
