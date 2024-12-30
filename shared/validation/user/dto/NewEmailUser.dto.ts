import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class NewEmailUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'Tomast1337',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(4)
  username: string;

  @ApiProperty({
    description: 'User email',
    example: 'vycasnicolas@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsEmail()
  email: string;
}
