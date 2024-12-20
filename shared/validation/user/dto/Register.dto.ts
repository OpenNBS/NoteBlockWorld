import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty()
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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
