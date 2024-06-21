import { SongStats } from '@shared/features/song/SongStats';

import { SongDocument } from '../../../../server/src/song/entity/song.entity';

export type SongViewUploader = {
  username: string;
  profileImage: string;
};

export class SongViewDto {
  publicId: string;
  createdAt: Date;
  editedAt: Date;
  uploader: SongViewUploader;
  playCount: number;
  downloadCount: number;
  likeCount: number;
  allowDownload: boolean;
  visibility: string;

  // SONG ATTRIBUTES
  title: string;
  originalAuthor: string;
  description: string;

  // SONG STATS
  songStats: SongStats;

  public static fromSongDocument(song: SongDocument): SongViewDto {
    const data = song.toJSON();

    // TODO: this is not type-safe

    return new SongViewDto({
      ...data,
      uploader: song.uploader as unknown as SongViewUploader,
    });
  }

  constructor(song: Partial<SongViewDto>) {
    Object.assign(this, song);
  }
}
