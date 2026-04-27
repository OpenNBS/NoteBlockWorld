import { z } from 'zod';

import { pageQueryDTOSchema } from '../common/PageQuery.dto.js';

export const songSearchQueryDTOSchema = pageQueryDTOSchema.extend({
  q: z.string().optional().default(''),
});

export type SongSearchQueryInput = z.input<typeof songSearchQueryDTOSchema>;
