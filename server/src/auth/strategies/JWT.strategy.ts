import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private static logger = new Logger(JwtStrategy.name);
  constructor(
    @Inject(ConfigService)
    configService: ConfigService,
  ) {
    const JWT_SECRET = configService.get<string>('JWT_SECRET');
    const JWT_EXPIRATION_TIME = configService.get<string>(
      'JWT_EXPIRATION_TIME',
    );
    if (!JWT_SECRET) {
      JwtStrategy.logger.error('Missing JWT_SECRET, cannot sign tokens');
      throw new Error('Missing JWT_SECRET');
    }
    if (!JWT_EXPIRATION_TIME) {
      JwtStrategy.logger.warn(
        'Missing JWT_EXPIRATION_TIME, using default of 1d',
      );
    }
    super({
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['HS256'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return { accessToken, refreshToken, profile };
  }
}
