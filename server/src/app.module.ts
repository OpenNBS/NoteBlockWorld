import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SongModule } from './song/song.module';

@Module({
  imports: [
    //DatabaseModule,
    ConfigModule.forRoot(),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): MongooseModuleFactoryOptions => {
        const uri = configService.get<string>('MONGODB_URL');
        return {
          uri: uri,
          retryAttempts: 10,
          retryDelay: 3000,
        };
      },
    }),

    SongModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
