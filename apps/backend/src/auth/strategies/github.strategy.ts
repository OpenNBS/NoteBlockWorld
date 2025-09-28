import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import strategy from 'passport-github';

@Injectable()
export class GithubStrategy extends PassportStrategy(strategy, 'github') {
  private static logger = new Logger(GithubStrategy.name);
  constructor(
    @Inject(ConfigService)
    configService: ConfigService,
  ) {
    const GITHUB_CLIENT_ID =
      configService.getOrThrow<string>('GITHUB_CLIENT_ID');

    const GITHUB_CLIENT_SECRET = configService.getOrThrow<string>(
      'GITHUB_CLIENT_SECRET',
    );

    const SERVER_URL = configService.getOrThrow<string>('SERVER_URL');

    super({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      redirect_uri: `${SERVER_URL}/v1/auth/github/callback`,
      scope: 'user:read,user:email',
      state: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    GithubStrategy.logger.debug(`GitHub Login Data ${JSON.stringify(profile)}`);

    return { accessToken, refreshToken, profile };
  }
}
