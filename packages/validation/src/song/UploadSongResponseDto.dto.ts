import { z } from 'zod';

import { songViewUploaderSchema } from './SongView.dto';

export const uploadSongResponseDtoSchema = z.object({
  publicId: z.string().min(1),
  title: z.string().min(1).max(128),
  uploader: songViewUploaderSchema,
  thumbnailUrl: z.string().url(),
  duration: z.number().min(0),
  noteCount: z.number().int().min(0),
});

export type UploadSongResponseDto = z.infer<typeof uploadSongResponseDtoSchema>;
