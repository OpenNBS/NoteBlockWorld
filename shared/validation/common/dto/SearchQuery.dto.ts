import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SearchQueryDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Nirvana - Dumb',
    description: 'Natural language query.',
  })
  query?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'dubstep',
    description: 'Filters the results by the specified category.',
    required: false,
  })
  category?: string;

  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'Page number.',
  })
  page?: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Max(100)
  @ApiProperty({
    example: 20,
    description: 'Number of results per page.',
  })
  limit?: number = 20;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'createdAt',
    description: 'Sort field.',
    required: false,
  })
  sort?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    example: false,
    description: 'Sort in ascending order if true, descending if false.',
    required: false,
  })
  order?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Search Users.',
  })
  searchUsers?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Search Songs.',
  })
  searchSongs?: boolean;

  constructor(partial: Partial<SearchQueryDTO>) {
    Object.assign(this, partial);
  }
}
