import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SongModule } from './song/song.module';
import { CommentModule } from './comment/comment.module';
import { PlaylistModule } from './playlist/playlist.module';
import { UserModule } from './user/user.module';
import { AchievementModule } from './achievement/achievement.module';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { ParseTokenPipe } from './song/parseToken';

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
    CommentModule,
    PlaylistModule,
    UserModule,
    AchievementModule,
    NotificationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ParseTokenPipe],
  exports: [ParseTokenPipe],
})
export class AppModule {}
