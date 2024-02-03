import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PageQuery {
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @ApiProperty({
    example: 1,
    description: 'page',
  })
  page: number;

  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @ApiProperty({
    example: 20,
    description: 'limit',
  })
  limit: number;

  @IsString()
  @ApiProperty({
    example: 'field',
    description: 'Sorts the results by the specified field.',
    required: false,
  })
  sort?: string;

  @IsBoolean()
  @ApiProperty({
    example: false,
    description:
      'Sorts the results in ascending order if true; in descending order if false.',
    required: false,
  })
  order?: boolean;

  constructor(partial: Partial<PageQuery>) {
    Object.assign(this, partial);
  }
}
