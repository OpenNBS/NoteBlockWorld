import { ApiProperty } from '@nestjs/swagger';
import { UserDocument } from '@server/user/entity/user.entity';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The public ID of the user',
    example: '5f4b6b2f-3b6d-4b1e-8b3d-2b0b7b3b4b7b',
    type: 'string',
  })
  publicId: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date the user was created',
    example: '2021-08-31T00:00:00.000Z',
    type: 'string',
  })
  creationDate: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date the user was last edited',
    example: '2021-08-31T00:00:00.000Z',
    type: 'string',
  })
  lastEdited: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date the user last logged in',
    example: '2021-08-31T00:00:00.000Z',
    type: 'string',
  })
  lastLogin: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The number of days the user has logged in consecutively',
    example: 0,
    type: 'number',
  })
  loginStreak: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The number of times the user has logged in',
    example: 0,
    type: 'number',
  })
  loginCount: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The number of times the user has played a song',
    example: 0,
    type: 'number',
  })
  playCount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The public name of the user',
    example: 'Nicolas Vycas Nery',
    type: 'string',
  })
  publicName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The username of the user',
    example: 'Hi Im Nicolas',
    type: 'string',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
    example: './assets/images/default-profile-image.png',
    type: 'string',
  })
  profileImage: string;

  @ApiProperty({
    description: 'The social links of the user',
    type: 'object',
  })
  socialLinks: {
    bandcamp?: string;
    discord?: string;
    facebook?: string;
    github?: string;
    instagram?: string;
    reddit?: string;
    snapchat?: string;
    soundcloud?: string;
    spotify?: string;
    steam?: string;
    telegram?: string;
    tiktok?: string;
    threads?: string;
    twitch?: string;
    x?: string;
    youtube?: string;
  };

  public static fromUserProfileDto(userDocument: UserDocument): UserProfileDto {
    return new UserProfileDto({
      publicId: userDocument.publicId,
      creationDate: userDocument.creationDate,
      lastEdited: userDocument.lastEdited,
      lastLogin: userDocument.lastLogin,
      loginStreak: userDocument.loginStreak,
      loginCount: userDocument.loginCount,
      playCount: userDocument.playCount,
      publicName: userDocument.publicName,
      description: userDocument.description,
      profileImage: userDocument.profileImage,
      socialLinks: userDocument.socialLinks,
    });
  }

  constructor(userProfile: Partial<UserProfileDto>) {
    Object.assign(this, userProfile);
  }
}
