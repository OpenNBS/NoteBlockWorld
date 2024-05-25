import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { CoverData } from './CoverData.dto';
import type { CategoryType, LicenseType, VisibilityType } from './types';
import { SongDocument } from '../../../../server/src/song/entity/song.entity';

export class UploadSongDto {
  @ApiProperty({
    description: 'The file to upload',
    type: 'file',
  })
  //@IsNotEmpty()
  //@Type(() => Blob)
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    default: true,
    description: 'Whether the song can be downloaded by other users',
    example: true,
  })
  allowDownload: boolean;

  @IsNotEmpty()
  @IsString()
  @IsIn(['public', 'private', 'unlisted'])
  @ApiProperty({
    enum: ['public', 'private', 'unlisted'],
    default: 'public',
    description: 'The visibility of the song',
    example: 'public',
  })
  visibility: VisibilityType;

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
  originalAuthor: string;

  @IsString()
  @MaxLength(2048)
  @ApiProperty({
    description: 'Description of the song',
    example: 'This is my song',
  })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Category of the song',
    example: 'Gaming',
  })
  category: CategoryType;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CoverData)
  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty({
    description: 'Cover data of the song',
    example: CoverData.getApiExample(),
  })
  coverData: CoverData;

  @IsNotEmpty()
  @IsString()
  @IsIn(['public', 'private', 'unlisted'])
  @ApiProperty({
    enum: ['public', 'private', 'unlisted'],
    default: 'public',
    description: 'The visibility of the song',
    example: 'public',
  })
  license: LicenseType;

  @IsArray()
  @MaxLength(64, { each: true })
  @ApiProperty({
    description:
      'List of custom instrument paths, one for each custom instrument in the song, relative to the assets/minecraft/sounds folder',
  })
  @Transform(({ value }) => JSON.parse(value))
  customInstruments: string[];

  constructor(partial: Partial<UploadSongDto>) {
    Object.assign(this, partial);
  }

  public static fromSongDocument(song: SongDocument): UploadSongDto {
    return new UploadSongDto({
      allowDownload: song.allowDownload,
      visibility: song.visibility,
      title: song.title,
      originalAuthor: song.originalAuthor,
      description: song.description,
      category: song.category,
      coverData: song.coverData,
      license: song.license,
      customInstruments: song.customInstruments ?? [],
    });
  }
}
