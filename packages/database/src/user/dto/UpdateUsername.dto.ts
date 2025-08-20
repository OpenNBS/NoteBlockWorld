import { USER_CONSTANTS } from '@nbw/config';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUsernameDto {
  @IsString()
  @MaxLength(USER_CONSTANTS.USERNAME_MAX_LENGTH)
  @MinLength(USER_CONSTANTS.USERNAME_MIN_LENGTH)
  @Matches(USER_CONSTANTS.ALLOWED_REGEXP)
  @ApiProperty({
    description: 'Username of the user',
    example: 'tomast1137',
  })
  username: string;
}
