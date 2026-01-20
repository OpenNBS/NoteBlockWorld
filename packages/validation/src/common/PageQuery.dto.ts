import { z } from 'zod';

import { TIMESPANS } from '@nbw/config';

export const pageQueryDTOSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional(),
  sort: z.string().optional().default('createdAt'),
  order: z
    .union([z.boolean(), z.string().transform((val) => val === 'true')])
    .optional()
    .default(false),
  timespan: z.enum(TIMESPANS as unknown as [string, ...string[]]).optional(),
});

export type PageQueryDTO = z.infer<typeof pageQueryDTOSchema>;
