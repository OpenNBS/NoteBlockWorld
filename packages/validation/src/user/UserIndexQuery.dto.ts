import { z } from 'zod';

import {
  pageQueryDTOSchema,
  type PageQueryDTO,
} from '../common/PageQuery.dto.js';
import { getUserSchema, type GetUser } from './GetUser.dto.js';

const nonEmptyLookupValue = (v: unknown): boolean =>
  typeof v === 'string' && v.trim().length > 0;

/**
 * `GET /user` query: either lookup by email/id/username, or paginated user list.
 * Non-empty `email`, `id`, or `username` selects lookup mode; otherwise pagination.
 */
export const userIndexQuerySchema = z
  .any()
  .transform((data): UserIndexQuery => {
    const raw =
      data !== null && typeof data === 'object'
        ? (data as Record<string, unknown>)
        : {};

    if (
      nonEmptyLookupValue(raw.email) ||
      nonEmptyLookupValue(raw.id) ||
      nonEmptyLookupValue(raw.username)
    ) {
      const parsed = getUserSchema.parse(raw);
      return { mode: 'lookup', ...parsed };
    }

    const paginated = pageQueryDTOSchema.parse(raw);
    return { mode: 'paginated', ...paginated };
  });

export type UserIndexQuery =
  | ({ mode: 'lookup' } & GetUser)
  | ({ mode: 'paginated' } & PageQueryDTO);
