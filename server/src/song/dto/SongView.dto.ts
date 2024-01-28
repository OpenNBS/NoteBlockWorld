import { UserDocument } from '@server/user/entity/user.entity';
import { HydratedDocument } from 'mongoose';
import { SongDocument } from '../entity/song.entity';
export class SongViewDto {
  creationDate: Date;
  lastEdited: Date;

  uploader?: string;

  playCount?: number;

  downloadCount?: number;

  likeCount?: number;

  allowDownload: boolean;

  visibility: string;

  // SONG ATTRIBUTES
  title: string;

  originalAuthor: string;

  description: string;

  duration?: number;

  tempo?: number;

  noteCount?: number;

  coverImageUrl?: string;

  nbsFileUrl?: string;

  // binary file data
  content?: Buffer;
  public static fromSongDocument(song: SongDocument): SongViewDto {
    const data = song.toJSON();
    return new SongViewDto({
      uploader: data.uploader,
      playCount: data.playCount,
      downloadCount: data.downloadCount,
      likeCount: data.likeCount,
      allowDownload: data.allowDownload,
      visibility: data.visibility,
      title: data.title,
      originalAuthor: data.originalAuthor,
      description: data.description,
      duration: data.duration,
      tempo: data.tempo,
      noteCount: data.noteCount,
      coverImageUrl: data.coverImageUrl,
      nbsFileUrl: data.nbsFileUrl,
      content: data.content,
    });
  }
  constructor(song: Partial<SongDocument>) {
    Object.assign(this, song);
  }
}
