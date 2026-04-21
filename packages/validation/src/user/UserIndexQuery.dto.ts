import { z } from 'zod';

import {
  pageQueryDTOSchema,
  type PageQueryInput,
} from '../common/PageQuery.dto';

import { getUserSchema } from './GetUser.dto';

/**
 * `GET /user` query: always paginated, optionally filtered by email/id/username.
 */
export const userIndexQuerySchema = pageQueryDTOSchema.extend({
  email: getUserSchema.shape.email.optional(),
  id: getUserSchema.shape.id.optional(),
  username: getUserSchema.shape.username.optional(),
});

export type UserIndexQuery = z.output<typeof userIndexQuerySchema>;
export type UserIndexQueryInput = z.input<typeof userIndexQuerySchema>;
export type UserIndexPageQueryInput = PageQueryInput & {
  email?: string;
  id?: string;
  username?: string;
};
