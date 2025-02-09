import { deepFreeze } from '../common/deepFreeze';

export const UserConst = deepFreeze({
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 32,
  ALLOWED_REGEXP: /^[a-zA-Z0-9-_.]*$/,
});
