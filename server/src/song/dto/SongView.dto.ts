import { UserDocument } from '@server/user/entity/user.entity';
import { HydratedDocument } from 'mongoose';
import { SongDocument } from '../entity/song.entity';
export class SongViewDto {
  uploadDate: Date;

  uploader: HydratedDocument<UserDocument>;

  playCount: number;

  downloadCount: number;

  likeCount: number;

  allowDownload: boolean;

  visibility: string;

  // SONG ATTRIBUTES
  title: string;

  originalAuthor: string;

  description: string;

  duration: number;

  tempo: number;

  noteCount: number;

  coverImageUrl: string;

  nbsFileUrl: string;

  // binary file data
  content: Buffer;
  static fromSongDocument(song: SongDocument): SongViewDto {
    const data = song.toJSON();
    return new SongViewDto({
      ...data,
      uploader: data.uploader.toJSON(),
    });
  }
  constructor(song: Partial<SongDocument>) {
    Object.assign(this, song);
  }
}
