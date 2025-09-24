import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    private static logger = new Logger(JwtStrategy.name);
    constructor(@Inject(ConfigService) config: ConfigService) {
        const JWT_SECRET = config.getOrThrow('JWT_SECRET');

        super({
            jwtFromRequest   : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey      : JWT_SECRET,
            passReqToCallback: true
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
            refreshToken
        };
    }
}
