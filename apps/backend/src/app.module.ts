import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AuthModule } from './auth/auth.module';
import { validate } from './config/EnvironmentVariables';
import { EmailLoginModule } from './email-login/email-login.module';
import { FileModule } from './file/file.module';
import { ParseTokenPipe } from './lib/parseToken';
import { MailingModule } from './mailing/mailing.module';
import { SeedModule } from './seed/seed.module';
import { SongModule } from './song/song.module';
import { SongBrowserModule } from './song-browser/song-browser.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal   : true,
      envFilePath: ['.env.development', '.env.production'],
      validate
    }),
    //DatabaseModule,
    MongooseModule.forRootAsync({
      imports   : [ConfigModule],
      inject    : [ConfigService],
      useFactory: (
        configService: ConfigService
      ): MongooseModuleFactoryOptions => {
        const url = configService.getOrThrow<string>('MONGO_URL');
        Logger.debug(`Connecting to ${url}`);

        return {
          uri          : url,
          retryAttempts: 10,
          retryDelay   : 3000
        };
      }
    }),
    // Mailing
    MailerModule.forRootAsync({
      imports   : [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const transport = configService.getOrThrow<string>('MAIL_TRANSPORT');
        const from = configService.getOrThrow<string>('MAIL_FROM');
        AppModule.logger.debug(`MAIL_TRANSPORT: ${transport}`);
        AppModule.logger.debug(`MAIL_FROM: ${from}`);
        return {
          transport: transport,
          defaults : {
            from: from
          },
          template: {
            dir    : __dirname + '/mailing/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true
            }
          }
        };
      },
      inject: [ConfigService]
    }),
    // Throttler
    ThrottlerModule.forRoot([
      {
        ttl  : 60,
        limit: 256 // 256 requests per minute
      }
    ]),
    SongModule,
    UserModule,
    AuthModule.forRootAsync(),
    FileModule.forRootAsync(),
    SongBrowserModule,
    SeedModule.forRoot(),
    EmailLoginModule,
    MailingModule
  ],
  controllers: [],
  providers  : [
    ParseTokenPipe,
    {
      provide : APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [ParseTokenPipe]
})
export class AppModule {
  static readonly logger = new Logger(AppModule.name);
}
