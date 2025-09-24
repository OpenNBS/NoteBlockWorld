import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class GetUser {
  @IsString()
  @IsOptional()
  @MaxLength(64)
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example    : 'vycasnicolas@gmailcom'
  })
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(64)
  @ApiProperty({
    description: 'Username of the user',
    example    : 'tomast1137'
  })
  username?: string;

  @IsString()
  @IsOptional()
  @MaxLength(64)
  @MinLength(24)
  @IsMongoId()
  @ApiProperty({
    description: 'ID of the user',
    example    : 'replace0me6b5f0a8c1a6d8c'
  })
  id?: string;

  constructor(partial: Partial<GetUser>) {
    Object.assign(this, partial);
  }
}
