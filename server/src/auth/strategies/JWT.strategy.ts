import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private static logger = new Logger(JwtStrategy.name);
  constructor(@Inject(ConfigService) config: ConfigService) {
    const JWT_SECRET = config.get('JWT_SECRET');
    if (!JWT_SECRET) {
      Logger.error('JWT_SECRET is not set');
      throw new Error('JWT_SECRET is not set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    });
  }

  public validate(req: Request, payload: any) {
    const refreshTokenHeader = req.headers?.authorization;
    const refreshTokenCookie = req.cookies?.refresh_token;
    const refreshToken = refreshTokenHeader
      ? refreshTokenHeader.split(' ')[1]
      : refreshTokenCookie;

    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    return {
      ...payload,
      refreshToken,
    };
  }
}
