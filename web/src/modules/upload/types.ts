import { z as zod } from 'zod';

import {
  coverDataSchema,
  uploadSongFormSchema,
} from './components/client/uploadSongForm.zod';

export type CoverData = zod.infer<typeof coverDataSchema>;

export type UploadSongForm = zod.infer<typeof uploadSongFormSchema>;
