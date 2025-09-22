import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private static logger = new Logger(GoogleStrategy.name);
  constructor(
    @Inject(ConfigService)
    configService: ConfigService,
  ) {
    const GOOGLE_CLIENT_ID =
      configService.getOrThrow<string>('GOOGLE_CLIENT_ID');

    const GOOGLE_CLIENT_SECRET = configService.getOrThrow<string>(
      'GOOGLE_CLIENT_SECRET',
    );

    const SERVER_URL = configService.getOrThrow<string>('SERVER_URL');

    const callbackURL = `${SERVER_URL}/api/v1/auth/google/callback`;
    GoogleStrategy.logger.debug(`Google Login callbackURL ${callbackURL}`);

    super({
      clientID    : GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL : callbackURL,
      scope       : ['email', 'profile'],
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
