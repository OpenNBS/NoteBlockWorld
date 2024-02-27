import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';
import { ParseTokenPipe } from './song/parseToken';
import { SongModule } from './song/song.module';
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
        const url = configService.get<string>('DB_HOST');
        const password = configService.get<string>('DB_PASSWORD');
        const user = configService.get<string>('DB_USER');
        if (!url || !password || !user) {
          Logger.error(
            'Missing DB config, define DB_HOST, DB_PASSWORD, DB_USER',
          );
          throw new Error('Missing DB config');
        }
        const uri = `mongodb+srv://${user}:${password}@${url}`;
        Logger.debug(`Connecting to ${uri}`);
        return {
          uri: uri,
          retryAttempts: 10,
          retryDelay: 3000,
        };
      },
    }),
    SongModule,
    UserModule,
    AuthModule,
  ],
  controllers: [FileController],
  providers: [ParseTokenPipe, FileService],
  exports: [ParseTokenPipe],
})
export class AppModule {}
