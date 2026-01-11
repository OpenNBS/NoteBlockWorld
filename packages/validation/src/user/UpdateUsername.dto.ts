import { z } from 'zod';

import { USER_CONSTANTS } from '@nbw/config';

export const updateUsernameDtoSchema = z.object({
  username: z
    .string()
    .min(USER_CONSTANTS.USERNAME_MIN_LENGTH)
    .max(USER_CONSTANTS.USERNAME_MAX_LENGTH)
    .regex(USER_CONSTANTS.ALLOWED_REGEXP),
});

export type UpdateUsernameDto = z.infer<typeof updateUsernameDtoSchema>;
