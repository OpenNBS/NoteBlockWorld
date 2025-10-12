import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '@server/auth/auth.module';
import { FileModule } from '@server/file/file.module';
import { TypesenseModule } from '@server/typesense/typesense.module';
import { UserModule } from '@server/user/user.module';

import { Song, SongSchema } from '@nbw/database';

import { MySongsController } from './my-songs/my-songs.controller';
import { SongIndexingService } from './song-indexing.service';
import { SongUploadService } from './song-upload/song-upload.service';
import { SongWebhookService } from './song-webhook/song-webhook.service';
import { SongController } from './song.controller';
import { SongService } from './song.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    FileModule.forRootAsync(),
    TypesenseModule,
  ],
  providers: [
    SongService,
    SongUploadService,
    SongWebhookService,
    SongIndexingService,
    {
      inject: [ConfigService],
      provide: 'DISCORD_WEBHOOK_URL',
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow('DISCORD_WEBHOOK_URL'),
    },
  ],
  controllers: [SongController, MySongsController],
  exports: [SongService],
})
export class SongModule {}
