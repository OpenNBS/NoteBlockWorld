import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as strategy from 'passport-github';

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
        'Missing GitHub config, define GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SERVER_URL',
      );

      throw new Error('Missing GitHub config');
    }

    super({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      redirect_uri: `${SERVER_URL}/auth/github/callback`,
      scope: 'user:read,user:email',
      state: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    GithubStrategy.logger.debug(`GitHub Login Data ${JSON.stringify(profile)}`);

    return { accessToken, refreshToken, profile };
  }
}
