import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

import type { SongWithUser } from '@database/song/entity/song.entity';

type SongPreviewUploader = {
  username: string;
  profileImage: string;
};

export class SongPreviewDto {
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @IsNotEmpty()
  uploader: SongPreviewUploader;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  originalAuthor: string;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  noteCount: number;

  @IsNotEmpty()
  @IsUrl()
  thumbnailUrl: string;

  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  updatedAt: Date;

  @IsNotEmpty()
  playCount: number;

  @IsNotEmpty()
  @IsString()
  visibility: string;

  constructor(partial: Partial<SongPreviewDto>) {
    Object.assign(this, partial);
  }

  public static fromSongDocumentWithUser(song: SongWithUser): SongPreviewDto {
    return new SongPreviewDto({
      publicId: song.publicId,
      uploader: song.uploader,
      title: song.title,
      description: song.description,
      originalAuthor: song.originalAuthor,
      duration: song.stats.duration,
      noteCount: song.stats.noteCount,
      thumbnailUrl: song.thumbnailUrl,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
      playCount: song.playCount,
      visibility: song.visibility,
    });
  }
}
