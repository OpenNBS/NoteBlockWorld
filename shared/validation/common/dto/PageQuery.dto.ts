import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { timespans } from '@shared/validation/song/constants';
import type { TimespanType } from '@shared/validation/song/dto/types';

export class PageQueryDTO {
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'page',
  })
  page?: number = 1;

  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Min(1)
  @Max(100)
  @ApiProperty({
    example: 20,
    description: 'limit',
  })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'field',
    description: 'Sorts the results by the specified field.',
    required: false,
  })
  sort?: string = 'createdAt';

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    example: false,
    description:
      'Sorts the results in ascending order if true; in descending order if false.',
    required: false,
  })
  order?: boolean = false;

  @IsEnum(timespans)
  @IsOptional()
  @ApiProperty({
    example: 'hour',
    description: 'Filters the results by the specified timespan.',
    required: false,
  })
  timespan?: TimespanType;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Bentroen',
    description: 'Filters results uploaded by a specific user (by username).',
    required: false,
  })
  user?: string;

  constructor(partial: Partial<PageQueryDTO>) {
    Object.assign(this, partial);
  }
}
