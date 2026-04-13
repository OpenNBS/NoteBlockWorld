import { z } from 'zod';

import { pageQueryDTOSchema } from '../common/PageQuery.dto.js';

/** Pagination + sort for `GET /song/search` (includes search string `q`). */
export const songSearchQueryDTOSchema = pageQueryDTOSchema.extend({
  q: z.string().optional().default(''),
});

export type SongSearchQueryDTO = z.output<typeof songSearchQueryDTOSchema>;
export type SongSearchQueryInput = z.input<typeof songSearchQueryDTOSchema>;
