import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import strategy from 'passport-magic-login';

@Injectable()
export class EmailStrategy extends PassportStrategy(strategy, 'email') {
  private static logger = new Logger(EmailStrategy.name);
  constructor(
    @Inject()
    configService: ConfigService,
  ) {
    const MAGIC_LINK_SECRET =
      configService.getOrThrow<string>('MAGIC_LINK_SECRET');

    const SERVER_URL = configService.getOrThrow<string>('SERVER_URL');

    super({
      secret: MAGIC_LINK_SECRET,
      callbackURL: `${SERVER_URL}/api/v1/auth/email/callback`,
      sendMagicLink: async (email: string, magicLink: string) => {
        EmailStrategy.logger.debug(`Magic Link: ${magicLink}`);
        EmailStrategy.logger.debug(`Email: ${email}`);
      },
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    EmailStrategy.logger.debug(`Email Login Data ${JSON.stringify(profile)}`);

    return { accessToken, refreshToken, profile };
  }
}
