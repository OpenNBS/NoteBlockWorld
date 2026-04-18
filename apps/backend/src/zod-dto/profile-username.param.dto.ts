import { createZodDto } from 'nestjs-zod';

import { profileUsernameParamSchema } from '@nbw/validation';

export class ProfileUsernameParamDto extends createZodDto(
  profileUsernameParamSchema,
) {}
