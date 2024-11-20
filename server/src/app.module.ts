import * as fs from 'fs';

import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { ParseTokenPipe } from './parseToken';
import { SongModule } from './song/song.module';
import { SongBrowserModule } from './song-browser/song-browser.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
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
  ],
  controllers: [],
  providers: [ParseTokenPipe],
  exports: [ParseTokenPipe],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);
  constructor(private readonly configService: ConfigService) {
    // read .env.development.example file
    const file = '.env.development.example';
    const encoding = 'utf8';
    const fileData = fs.readFileSync(file, encoding);

    const variableToIgnore = ['APP_DOMAIN', 'NODE_ENV', 'WHITELISTED_USERS'];

    const variables = fileData
      .split('\n')
      // trim whitespace
      .map((line) => line.trim())
      // remove empty lines
      .filter((line) => line.length > 0)
      // get variable names
      .map((line) => line.split('=')[0])
      // remove variables that are not in the .env.development.example file
      .filter((variable) => !variableToIgnore.includes(variable));

    this.logger.warn(`Ignoring variables: ${variableToIgnore.join(', ')}`);
    this.logger.warn(`Checking variables: ${variables.join(', ')}`);

    let isMissing = false;

    for (const variable of variables) {
      const value = this.configService.get(variable);

      if (!value) {
        this.logger.error(
          `Missing environment variable ${variable} in env vars}`,
        );

        isMissing = true;
      }
    }

    if (isMissing) {
      throw new Error('Missing environment variables in env vars file');
    }
  }
}
