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
import { CoverData } from './CoverData.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UploadSongDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @IsUUID()
  @ApiProperty({
    description: 'MongoDB ID of the uploader user',
    example: '5f9d7a3b9d3e4a1b1c9d9d9d',
  })
  uploader: string;

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
    example: {
      zoomLevel: {
        min: 1,
        max: 5,
        default: 3,
      },
      startTick: {
        min: 0,
        default: 1,
      },
      startLayer: {
        min: 0,
        default: 1,
      },
      backgroundColor: {
        default: '#000000',
      },
    },
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
}
