import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as strategy from 'passport-auth0';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Auth0Strategy extends PassportStrategy(strategy, 'auth0') {
  private static logger = new Logger(Auth0Strategy.name);
  constructor(
    @Inject(ConfigService)
    configService: ConfigService,
  ) {
    const ZERO_CLIENT_ID = configService.get<string>('ZERO_CLIENT_ID');
    const ZERO_CLIENT_SECRET = configService.get<string>('ZERO_CLIENT_SECRET');
    if (!ZERO_CLIENT_ID || !ZERO_CLIENT_SECRET) {
      Auth0Strategy.logger.error(
        'Missing Auth0 config, define ZERO_CLIENT_ID, ZERO_CLIENT_SECRET',
      );
      throw new Error('Missing Auth0 config');
    }
    // TODO: verify that this is the correct domain, add them to env
    super({
      clientID: ZERO_CLIENT_ID,
      clientSecret: ZERO_CLIENT_SECRET,
      domain: 'dev-2q3x3q3z.us.auth0.com',
      callbackURL: 'http://localhost:3000/auth/callback',
      scope: 'user:read',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return { accessToken, refreshToken, profile };
  }
}
