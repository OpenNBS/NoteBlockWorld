import { UserDocument } from '@server/user/entity/user.entity';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { SongDocument } from '../entity/song.entity';
export class SongPreviewDto {
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
  coverImageUrl: string;

  constructor(partial: Partial<SongPreviewDto>) {
    Object.assign(this, partial);
  }

  public static fromSongDocument(song: SongDocument): SongPreviewDto {
    const data = song.toJSON();
    return new SongPreviewDto({
      uploader: data.uploader.toString(),
      title: data.title,
      originalAuthor: data.originalAuthor,
      duration: data.duration,
      noteCount: data.noteCount,
      coverImageUrl: data.coverImageUrl,
    });
  }
}
