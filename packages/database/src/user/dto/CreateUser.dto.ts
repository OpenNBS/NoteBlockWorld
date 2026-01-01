import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateUser {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'vycasnicolas@gmailcom',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @ApiProperty({
    description: 'Username of the user',
    example: 'tomast1137',
  })
  username: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'Profile image of the user',
    example: 'https://example.com/image.png',
  })
  profileImage: string;

  constructor(partial: Partial<CreateUser>) {
    Object.assign(this, partial);
  }
}
