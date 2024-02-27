import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@server/auth/auth.module';
import { UserModule } from '@server/user/user.module';

import { Song, SongSchema } from './entity/song.entity';
import { SongController } from './song.controller';
import { SongService } from './song.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    AuthModule,
    UserModule,
  ],
  providers: [SongService],
  controllers: [SongController],
  exports: [SongService],
})
export class SongModule {}
