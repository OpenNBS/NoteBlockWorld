import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PageDto<T> {
  @IsNotEmpty()
  @IsNumber({
    allowNaN        : false,
    allowInfinity   : false,
    maxDecimalPlaces: 0,
  })
  @ApiProperty({
    example    : 150,
    description: 'Total number of items available',
  })
  total: number;

  @IsNotEmpty()
  @IsNumber({
    allowNaN        : false,
    allowInfinity   : false,
    maxDecimalPlaces: 0,
  })
  @ApiProperty({
    example    : 1,
    description: 'Current page number',
  })
  page: number;

  @IsNotEmpty()
  @IsNumber({
    allowNaN        : false,
    allowInfinity   : false,
    maxDecimalPlaces: 0,
  })
  @ApiProperty({
    example    : 20,
    description: 'Number of items per page',
  })
  limit: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example    : 'createdAt',
    description: 'Field used for sorting',
    required   : false,
  })
  sort?: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example    : false,
    description: 'Sort order: true for ascending, false for descending',
  })
  order: boolean;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({
    description: 'Array of items for the current page',
    isArray    : true,
  })
  content: T[];

  constructor(partial: Partial<PageDto<T>>) {
    Object.assign(this, partial);
  }
}
