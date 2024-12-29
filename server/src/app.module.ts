import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { validate } from './config/EnvironmentVariables';
import { CryptoModule } from './crypto/crypto.module';
import { EmailLoginModule } from './email-login/email-login.module';
import { FileModule } from './file/file.module';
import { MailingModule } from './mailing/mailing.module';
import { ParseTokenPipe } from './parseToken';
import { SeedModule } from './seed/seed.module';
import { SongModule } from './song/song.module';
import { SongBrowserModule } from './song-browser/song-browser.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
      validate,
    }),
    //DatabaseModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): MongooseModuleFactoryOptions => {
        const url = configService.getOrThrow<string>('MONGO_URL');
        Logger.debug(`Connecting to ${url}`);

        return {
          uri: url,
          retryAttempts: 10,
          retryDelay: 3000,
        };
      },
    }),
    SongModule,
    UserModule,
    AuthModule.forRootAsync(),
    FileModule.forRootAsync(),
    SongBrowserModule,
    CryptoModule,
    SeedModule.forRoot(),
    EmailLoginModule,
    MailingModule,
  ],
  controllers: [],
  providers: [ParseTokenPipe],
  exports: [ParseTokenPipe],
})
export class AppModule {}
