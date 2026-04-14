import { z } from 'zod';

/** Query for `GET /song/:id/download` */
export const songFileQueryDTOSchema = z.object({
  src: z.string(),
});
