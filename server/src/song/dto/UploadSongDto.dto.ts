import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { SongDocument } from '../entity/song.entity';
import { CoverData } from './CoverData.dto';

export class UploadSongDto {
  @ApiProperty({
    description: 'The file to upload',
    type: 'file',
  })
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: false,
    description: 'Whether the song can be downloaded by other users',
    example: false,
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
  visibility: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @ApiProperty({
    description: 'Title of the song',
    example: 'My Song',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @ApiProperty({
    description: 'Original author of the song',
    example: 'Myself',
  })
  originalAuthor: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2048)
  @ApiProperty({
    description: 'Description of the song',
    example: 'This is my song',
  })
  description: string;

  @ValidateNested()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Cover data of the song',
    example: CoverData.getApiExample(),
  })
  coverData: CoverData;

  @IsArray()
  @ApiProperty({
    description:
      'List of custom instrument paths, one for each custom instrument in the song, relative to the assets/minecraft/sounds folder',
  })
  customInstruments: string[];

  constructor(partial: Partial<UploadSongDto>) {
    Object.assign(this, partial);
  }

  public static fromSongDocument(song: SongDocument): UploadSongDto {
    const data = song.toJSON();
    return new UploadSongDto({
      allowDownload: song.allowDownload,
      visibility: song.visibility,
      title: song.title,
      originalAuthor: song.originalAuthor,
      description: song.description,
    });
  }
}
