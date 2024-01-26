import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PageQuery {
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    example: '1',
    description: 'page',
  })
  page: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    example: '10',
    description: 'limit',
  })
  limit: string;

  constructor(partial: Partial<PageQuery>) {
    Object.assign(this, partial);
  }
}
