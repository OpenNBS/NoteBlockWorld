import { z } from 'zod';

import { pageQueryDTOSchema } from '@nbw/validation/src';

pageQueryDTOSchema.extend({
  q: z.string().optional().default(''),
});
