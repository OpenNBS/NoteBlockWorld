import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
} from 'class-validator';

import { SongDocument } from '../entity/song.entity';

type SongPreviewUploader = {
  username: string;
  profileImage: string;
};

export class SongPreviewDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  publicId: string;

  @IsNotEmpty()
  uploader: SongPreviewUploader;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  title: string;

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

  @IsNotEmpty()
  @IsString()
  description: string;

  constructor(partial: Partial<SongPreviewDto>) {
    Object.assign(this, partial);
  }

  public static fromSongDocument(song: SongDocument): SongPreviewDto {
    return new SongPreviewDto({
      publicId: song.publicId,
      uploader: song.uploader as unknown as SongPreviewUploader,
      title: song.title,
      originalAuthor: song.originalAuthor,
      duration: song.duration,
      noteCount: song.noteCount,
      thumbnailUrl: song.thumbnailUrl,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
      playCount: song.playCount,
      visibility: song.visibility,
    });
  }
}
