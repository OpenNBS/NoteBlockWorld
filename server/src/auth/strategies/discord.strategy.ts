import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import strategy from 'passport-discord';

@Injectable()
export class DiscordStrategy extends PassportStrategy(strategy, 'discord') {
  private static logger = new Logger(DiscordStrategy.name);
  constructor(
    @Inject(ConfigService)
    configService: ConfigService,
  ) {
    const DISCORD_CLIENT_ID = configService.get<string>('DISCORD_CLIENT_ID');

    const DISCORD_CLIENT_SECRET = configService.get<string>(
      'DISCORD_CLIENT_SECRET',
    );

    const SERVER_URL = configService.get<string>('SERVER_URL');

    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !SERVER_URL) {
      throw new Error('Missing Discord config');
    }

    super({
      clientID: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      redirect_uri: `${SERVER_URL}/api/v1/auth/discord/callback`,
      scope: ['identify', 'email'],
      state: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    DiscordStrategy.logger.debug(
      `Discord Login Data ${JSON.stringify(profile)}`,
    );

    return { accessToken, refreshToken, profile };
  }
}
