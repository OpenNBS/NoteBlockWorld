import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
} from 'class-validator';

import { SongDocument } from '../entity/song.entity';

export class SongPreviewDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsString()
  @MaxLength(64)
  @IsUUID()
  uploader?: string;

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
      id: song._id.toString(),
      uploader: song.uploader.toString(),
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
