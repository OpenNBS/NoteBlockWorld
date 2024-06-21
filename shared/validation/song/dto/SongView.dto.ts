import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

import { SongStats } from '@shared/features/song/SongStats';

import { SongDocument } from '../../../../server/src/song/entity/song.entity';

export type SongViewUploader = {
  username: string;
  profileImage: string;
};

export class SongViewDto {
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  uploader: SongViewUploader;

  @IsUrl()
  @IsNotEmpty()
  thumbnailUrl: string;

  @IsNumber()
  @IsNotEmpty()
  playCount: number;

  @IsNumber()
  @IsNotEmpty()
  downloadCount: number;

  @IsNumber()
  @IsNotEmpty()
  likeCount: number;

  @IsBoolean()
  @IsNotEmpty()
  allowDownload: boolean;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  originalAuthor: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  license: string;

  customInstruments: string[];

  @IsNumber()
  @IsNotEmpty()
  fileSize: number;

  @IsNotEmpty()
  stats: SongStats;

  public static fromSongDocument(song: SongDocument): SongViewDto {
    return new SongViewDto({
      publicId: song.publicId,
      createdAt: song.createdAt,
      uploader: song.uploader as unknown as SongViewUploader,
      thumbnailUrl: song.thumbnailUrl,
      playCount: song.playCount,
      downloadCount: song.downloadCount,
      likeCount: song.likeCount,
      allowDownload: song.allowDownload,
      title: song.title,
      originalAuthor: song.originalAuthor,
      description: song.description,
      category: song.category,
      license: song.license,
      customInstruments: song.customInstruments,
      fileSize: song.fileSize,
      stats: song.stats,
    });
  }

  constructor(song: SongViewDto) {
    Object.assign(this, song);
  }
}
