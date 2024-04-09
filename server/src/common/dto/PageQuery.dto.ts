import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PageQuery {
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'page',
  })
  page: number = 1;

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
  limit: number = 10;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'field',
    description: 'Sorts the results by the specified field.',
    required: false,
  })
  sort?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    example: false,
    description:
      'Sorts the results in ascending order if true; in descending order if false.',
    required: false,
  })
  order?: boolean = false;

  constructor(partial: Partial<PageQuery>) {
    Object.assign(this, partial);
  }
}
