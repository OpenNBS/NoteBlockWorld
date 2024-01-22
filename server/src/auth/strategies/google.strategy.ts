import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private static logger = new Logger(GoogleStrategy.name);
  constructor(
    @Inject(ConfigService)
    configService: ConfigService,
  ) {
    const GOOGLE_CLIENT_ID = configService.get<string>('GOOGLE_CLIENT_ID');
    const GOOGLE_CLIENT_SECRET = configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    );
    const SERVER_URL = configService.get<string>('SERVER_URL');
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SERVER_URL) {
      GoogleStrategy.logger.error(
        'Missing Google config, define GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET or SERVER_URL',
      );
      throw new Error('Missing Google config');
    }

    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${SERVER_URL}/auth/google/callback`,
      scope: 'user:read',
      state: false,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): any {
    GoogleStrategy.logger.debug(`Google Login Data ${JSON.stringify(profile)}`);
    done(null, profile);
  }
}
