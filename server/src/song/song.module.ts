import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { Song, SongSchema } from './entity/song.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
  ],
  providers: [SongService],
  controllers: [SongController],
  exports: [SongService],
})
export class SongModule {}
