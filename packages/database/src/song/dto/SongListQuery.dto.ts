import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum SongSortType {
  RECENT = 'recent',
  RANDOM = 'random',
  PLAY_COUNT = 'play-count',
  TITLE = 'title',
  DURATION = 'duration',
  NOTE_COUNT = 'note-count',
}

export enum SongOrderType {
  ASC = 'asc',
  DESC = 'desc',
}

export class SongListQueryDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'my search query',
    description: 'Search string to filter songs by title or description',
    required: false,
  })
  q?: string;

  @IsEnum(SongSortType)
  @IsOptional()
  @ApiProperty({
    enum: SongSortType,
    example: SongSortType.RECENT,
    description: 'Sort songs by the specified criteria',
    required: false,
  })
  sort?: SongSortType = SongSortType.RECENT;

  @IsEnum(SongOrderType)
  @IsOptional()
  @ApiProperty({
    enum: SongOrderType,
    example: SongOrderType.DESC,
    description: 'Sort order (only applies if sort is not random)',
    required: false,
  })
  order?: SongOrderType = SongOrderType.DESC;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'pop',
    description:
      'Filter by category. If left empty, returns songs in any category',
    required: false,
  })
  category?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'username123',
    description:
      'Filter by uploader username. If provided, will only return songs uploaded by that user',
    required: false,
  })
  uploader?: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
  })
  page?: number = 1;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Min(1)
  @Max(100)
  @ApiProperty({
    example: 10,
    description: 'Number of items to return per page',
    required: false,
  })
  limit?: number = 10;

  constructor(partial: Partial<SongListQueryDTO>) {
    Object.assign(this, partial);
  }
}
