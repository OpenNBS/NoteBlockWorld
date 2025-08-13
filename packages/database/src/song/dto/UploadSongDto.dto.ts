import { UPLOAD_CONSTANTS } from '@nbw/config';
import type { SongDocument } from '@database/song/entity/song.entity';
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
import { ThumbnailData } from './ThumbnailData.dto';
import type { CategoryType, LicenseType, VisibilityType } from './types';

const visibility = Object.keys(UPLOAD_CONSTANTS.visibility) as Readonly<
  string[]
>;
const categories = Object.keys(UPLOAD_CONSTANTS.categories) as Readonly<
  string[]
>;
const licenses = Object.keys(UPLOAD_CONSTANTS.licenses) as Readonly<string[]>;

export class UploadSongDto {
  @ApiProperty({
    description: 'The file to upload',
    // @ts-ignore //TODO: fix this
    type: 'file',
  })
  file: any; //TODO: Express.Multer.File;

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
  @IsIn(visibility)
  @ApiProperty({
    enum: visibility,
    default: visibility[0],
    description: 'The visibility of the song',
    example: visibility[0],
  })
  visibility: VisibilityType;

  @IsNotEmpty()
  @IsString()
  @MaxLength(UPLOAD_CONSTANTS.title.maxLength)
  @ApiProperty({
    description: 'Title of the song',
    example: 'My Song',
  })
  title: string;

  @IsString()
  @MaxLength(UPLOAD_CONSTANTS.originalAuthor.maxLength)
  @ApiProperty({
    description: 'Original author of the song',
    example: 'Myself',
  })
  originalAuthor: string;

  @IsString()
  @MaxLength(UPLOAD_CONSTANTS.description.maxLength)
  @ApiProperty({
    description: 'Description of the song',
    example: 'This is my song',
  })
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(categories)
  @ApiProperty({
    enum: categories,
    description: 'Category of the song',
    example: categories[0],
  })
  category: CategoryType;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ThumbnailData)
  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty({
    description: 'Thumbnail data of the song',
    example: ThumbnailData.getApiExample(),
  })
  thumbnailData: ThumbnailData;

  @IsNotEmpty()
  @IsString()
  @IsIn(licenses)
  @ApiProperty({
    enum: licenses,
    default: licenses[0],
    description: 'The visibility of the song',
    example: licenses[0],
  })
  license: LicenseType;

  @IsArray()
  @MaxLength(UPLOAD_CONSTANTS.customInstruments.maxCount, { each: true })
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
      thumbnailData: song.thumbnailData,
      license: song.license,
      customInstruments: song.customInstruments ?? [],
    });
  }
}
