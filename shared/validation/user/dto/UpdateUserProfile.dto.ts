import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export const LinkRegexes = {
  bandcamp: /https?:\/\/[a-zA-Z0-9_-]+\.bandcamp\.com\/?/,
  discord: /https?:\/\/(www\.)?discord\.com\/[a-zA-Z0-9_]+/,
  facebook: /https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_]+/,
  github: /https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+/,
  instagram: /https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_]+/,
  reddit: /https?:\/\/(www\.)?reddit\.com\/user\/[a-zA-Z0-9_-]+/,
  snapchat: /https?:\/\/(www\.)?snapchat\.com\/add\/[a-zA-Z0-9_-]+/,
  soundcloud: /https?:\/\/(www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+/,
  spotify: /https?:\/\/open\.spotify\.com\/artist\/[a-zA-Z0-9?&=]+/,
  steam: /https?:\/\/steamcommunity\.com\/id\/[a-zA-Z0-9_-]+/,
  telegram: /https?:\/\/(www\.)?t\.me\/[a-zA-Z0-9_]+/,
  tiktok: /https?:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9_]+/,
  threads: /https?:\/\/(www\.)?threads\.net\/@?[a-zA-Z0-9_]+/,
  twitch: /https?:\/\/(www\.)?twitch\.tv\/[a-zA-Z0-9_]+/,
  x: /https?:\/\/(www\.)?x\.com\/[a-zA-Z0-9_]+/,
  youtube: /https?:\/\/(www\.)?youtube\.com\/@?[a-zA-Z0-9_-]+/,
};

export class UserLinks {
  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.bandcamp)
  bandcamp?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.discord)
  discord?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.facebook)
  facebook?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.github)
  github?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.instagram)
  instagram?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.reddit)
  reddit?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.snapchat)
  snapchat?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.soundcloud)
  soundcloud?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.spotify)
  spotify?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.steam)
  steam?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.telegram)
  telegram?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.tiktok)
  tiktok?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.threads)
  threads?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.twitch)
  twitch?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.x)
  x?: string;

  @IsOptional()
  @IsUrl()
  @Matches(LinkRegexes.youtube)
  youtube?: string;
}

export class UpdateUserProfileDto {
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  @IsOptional()
  @ApiProperty({
    description: 'Username of the user',
    example: 'tomast1137',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  @ApiProperty({
    description: 'Description of the user',
    example: 'I using noteblock.world',
  })
  description?: string;

  @IsOptional()
  @Type(() => UserLinks)
  @ApiProperty({
    description: 'Social media links of the user',
    example: {
      github: 'https://github.com/tomast1337',
      youtube: 'https://www.youtube.com/@Bentroen_',
      spotify:
        'https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG?si=v95i3XbRRgKT9JwyiFiFEg',
      bandcamp: 'https://igorrr.bandcamp.com/',
      facebook: 'https://www.facebook.com/MrBean',
      reddit: 'https://www.reddit.com/user/Unidan/',
      soundcloud: 'https://soundcloud.com/futureisnow',
      steam: 'https://steamcommunity.com/id/CattleDecapitation/',
      x: 'https://x.com/Trail_Cams',
      twitch: 'https://www.twitch.tv/vinesauce',
      threads: 'https://www.threads.net/@kimkardashian',
      tiktok: 'https://www.tiktok.com/@karolg',
      snapchat: 'https://www.snapchat.com/add/username',
      instagram: 'https://instagram.com/validuser',
      discord: 'https://discord.com/validuser',
      telegram: 'https://t.me/validuser',
    },
  })
  socialLinks?: UserLinks;
}
