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
import { EmailStrategy } from './strategies/email.strategy';

@Module({})
export class AuthModule {
  static forRootAsync(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        UserModule,
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
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
        EmailStrategy,
        JwtStrategy,
        {
          provide: 'FRONTEND_URL',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('FRONTEND_URL'),
        },
        {
          provide: 'JWT_SECRET',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_SECRET'),
        },
        {
          provide: 'JWT_EXPIRES_IN',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_EXPIRES_IN'),
        },
        {
          provide: 'JWT_REFRESH_SECRET',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
        {
          provide: 'JWT_REFRESH_EXPIRES_IN',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
        },
        {
          provide: 'WHITELISTED_USERS',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('WHITELISTED_USERS'),
        },
        {
          provide: 'APP_DOMAIN',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('APP_DOMAIN'),
        },
      ],
      exports: [AuthService],
    };
  }
}
