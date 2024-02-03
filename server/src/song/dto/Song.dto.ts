import { UserDocument } from '@server/user/entity/user.entity';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { SongDocument } from '../entity/song.entity';

export class SongDto {
  @IsString()
  _id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  uploader: string | UserDocument;

  @IsNumber()
  playCount: number;

  @IsNumber()
  downloadCount: number;

  @IsNumber()
  likeCount: number;

  @IsBoolean()
  allowDownload: boolean;

  @IsString()
  visibility: string;

  @IsString()
  title: string;

  @IsString()
  originalAuthor: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNumber()
  tempo?: number;

  @IsOptional()
  @IsNumber()
  noteCount?: number;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  nbsFileUrl?: string;

  constructor(data: Partial<SongDto>) {
    Object.assign(this, data);
  }

  public static fromSongDocument = (song: SongDocument): SongDto => {
    return new SongDto({
      _id: song._id.toString(),
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
      uploader: song.uploader.toString(),
      playCount: song.playCount,
      downloadCount: song.downloadCount,
      likeCount: song.likeCount,
      allowDownload: song.allowDownload,
      visibility: song.visibility,
      title: song.title,
      originalAuthor: song.originalAuthor,
      description: song.description,
      duration: song.duration,
      tempo: song.tempo,
      noteCount: song.noteCount,
      coverImageUrl: song.coverImageUrl,
      nbsFileUrl: song.nbsFileUrl,
    });
  };
}
