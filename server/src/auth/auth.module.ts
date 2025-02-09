import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '@server/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DiscordStrategy } from './strategies/discord.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/JWT.strategy';

@Module({})
export class AuthModule {
  static forRootAsync(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        UserModule,
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          inject: [ConfigService],
          imports: [ConfigModule],
          useFactory: async (config: ConfigService) => {
            const JWT_SECRET = config.get('JWT_SECRET');
            const JWT_EXPIRES_IN = config.get('JWT_EXPIRES_IN');

            if (!JWT_SECRET) {
              Logger.error('JWT_SECRET is not set');
              throw new Error('JWT_SECRET is not set');
            }

            if (!JWT_EXPIRES_IN) {
              Logger.warn('JWT_EXPIRES_IN is not set, using default of 60s');
            }

            return {
              secret: JWT_SECRET,
              signOptions: { expiresIn: JWT_EXPIRES_IN || '60s' },
            };
          },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        ConfigService,
        GoogleStrategy,
        GithubStrategy,
        DiscordStrategy,
        JwtStrategy,
        {
          inject: [ConfigService],
          provide: 'COOKIE_EXPIRES_IN',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('COOKIE_EXPIRES_IN'),
        },
        {
          inject: [ConfigService],
          provide: 'SERVER_URL',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('SERVER_URL'),
        },
        {
          inject: [ConfigService],
          provide: 'FRONTEND_URL',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('FRONTEND_URL'),
        },
        {
          inject: [ConfigService],
          provide: 'JWT_SECRET',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_SECRET'),
        },
        {
          inject: [ConfigService],
          provide: 'JWT_EXPIRES_IN',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_EXPIRES_IN'),
        },
        {
          inject: [ConfigService],
          provide: 'JWT_REFRESH_SECRET',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
        {
          inject: [ConfigService],
          provide: 'JWT_REFRESH_EXPIRES_IN',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
        },
        {
          inject: [ConfigService],
          provide: 'WHITELISTED_USERS',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('WHITELISTED_USERS'),
        },
        {
          inject: [ConfigService],
          provide: 'APP_DOMAIN',
          useFactory: (configService: ConfigService) =>
            configService.get<string>('APP_DOMAIN'),
        },
      ],
      exports: [AuthService],
    };
  }
}
