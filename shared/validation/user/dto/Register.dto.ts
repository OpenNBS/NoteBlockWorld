import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User name',
    example: 'Tomast1337',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(4)
  username: string;

  /*
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(4)
  publicName: string;
*/
  @ApiProperty({
    description: 'User email',
    example: 'vycasnicolas@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'supersecretpassword',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
