import { z } from 'zod';

import { TIMESPANS } from '../config-shim.js';

export const pageQueryDTOSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.string().optional().default('createdAt'),
  order: z
    .union([z.boolean(), z.string().transform((val) => val === 'true')])
    .optional()
    .default(false),
  timespan: z.enum(TIMESPANS as unknown as [string, ...string[]]).optional(),
});

/** Parsed query (defaults applied). */
export type PageQueryDTO = z.output<typeof pageQueryDTOSchema>;
/** Raw query / pre-parse shape (e.g. Nest `@Query()`). */
export type PageQueryInput = z.input<typeof pageQueryDTOSchema>;
