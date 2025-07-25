import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { UserConst } from '../constants';

export class UpdateUsernameDto {
  @IsString()
  @MaxLength(UserConst.USERNAME_MAX_LENGTH)
  @MinLength(UserConst.USERNAME_MIN_LENGTH)
  @Matches(UserConst.ALLOWED_REGEXP)
  @ApiProperty({
    description: 'Username of the user',
    example: 'tomast1137',
  })
  username: string;
}
