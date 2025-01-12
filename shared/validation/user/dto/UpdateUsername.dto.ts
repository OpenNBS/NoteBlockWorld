import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUsernameDto {
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  @ApiProperty({
    description: 'Username of the user',
    example: 'tomast1137',
  })
  username: string;
}
