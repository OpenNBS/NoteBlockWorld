import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
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

  validate(req: Request, payload: any) {
    const refreshToken = req.headers.authorization
      ?.replace('Bearer', '')
      .trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
