import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as strategy from 'passport-github';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(strategy, 'github') {
  private static logger = new Logger(GithubStrategy.name);
  constructor(
    @Inject(ConfigService)
    configService: ConfigService,
  ) {
    const GITHUB_CLIENT_ID = configService.get<string>('GITHUB_CLIENT_ID');
    const GITHUB_CLIENT_SECRET = configService.get<string>(
      'GITHUB_CLIENT_SECRET',
    );
    const SERVER_URL = configService.get<string>('SERVER_URL');

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !SERVER_URL) {
      GithubStrategy.logger.error(
        'Missing Github config, define GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SERVER_URL',
      );
      throw new Error('Missing Github config');
    }

    super({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      redirect_uri: `${SERVER_URL}/auth/github/callback`,
      scope: 'user:read',
      state: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    GithubStrategy.logger.debug(`Github Login Data ${JSON.stringify(profile)}`);
    return { accessToken, refreshToken, profile };
  }
}
