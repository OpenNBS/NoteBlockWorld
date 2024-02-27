import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as strategy from 'passport-auth0';

@Injectable()
export class Auth0Strategy extends PassportStrategy(strategy, 'auth0') {
  private static logger = new Logger(Auth0Strategy.name);
  constructor(
    @Inject(ConfigService)
    configService: ConfigService,
  ) {
    const ZERO_CLIENT_ID = configService.get<string>('ZERO_CLIENT_ID');
    const ZERO_CLIENT_SECRET = configService.get<string>('ZERO_CLIENT_SECRET');
    const ZERO_DOMAIN = configService.get<string>('ZERO_DOMAIN');
    if (!ZERO_CLIENT_ID || !ZERO_CLIENT_SECRET || !ZERO_DOMAIN) {
      Auth0Strategy.logger.error(
        'Missing Auth0 config, define ZERO_CLIENT_ID, ZERO_CLIENT_SECRE, ZERO_DOMAIN',
      );
      throw new Error('Missing Auth0 config');
    }
    // TODO: verify that this is the correct domain, add them to env
    super({
      clientID: ZERO_CLIENT_ID,
      clientSecret: ZERO_CLIENT_SECRET,
      domain: ZERO_DOMAIN,
      callbackURL: 'http://localhost:4000/api/v1/auth/auth0/callback',
      scope: 'user:read',
      state: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return { accessToken, refreshToken, profile };
  }
}
