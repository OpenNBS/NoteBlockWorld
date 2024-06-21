import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import * as SongViewDto from './SongView.dto';
import { ThumbnailData } from './ThumbnailData.dto';
import { SongWithUser } from '../../../../server/src/song/entity/song.entity';

export class UploadSongResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the song',
    example: '1234567890abcdef12345678',
  })
  publicId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @ApiProperty({
    description: 'Title of the song',
    example: 'My Song',
  })
  title: string;

  @IsString()
  @MaxLength(64)
  @ApiProperty({
    description: 'Original author of the song',
    example: 'Myself',
  })
  uploader: SongViewDto.SongViewUploader;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ThumbnailData)
  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty({
    description: 'Thumbnail data of the song',
    example: ThumbnailData.getApiExample(),
  })
  thumbnailUrl: string;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  noteCount: number;

  constructor(partial: Partial<UploadSongResponseDto>) {
    Object.assign(this, partial);
  }

  public static fromSongWithUserDocument(
    song: SongWithUser,
  ): UploadSongResponseDto {
    return new UploadSongResponseDto({
      publicId: song.publicId,
      title: song.title,
      uploader: song.uploader,
      duration: song.songStats.duration,
      thumbnailUrl: song.thumbnailUrl,
      noteCount: song.songStats.noteCount,
    });
  }
}
