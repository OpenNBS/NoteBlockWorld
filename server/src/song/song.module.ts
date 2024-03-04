import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@server/auth/auth.module';
import { FileModule } from '@server/file/file.module';
import { UserModule } from '@server/user/user.module';

import { Song, SongSchema } from './entity/song.entity';
import { MySongsController } from './my-songs/my-songs.controller';
import { SongController } from './song.controller';
import { SongService } from './song.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    AuthModule,
    UserModule,
    FileModule,
  ],
  providers: [SongService],
  controllers: [SongController, MySongsController],
  exports: [SongService],
})
export class SongModule {}
