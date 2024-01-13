import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';

@Module({
  providers: [SongService],
  controllers: [SongController],
})
export class SongModule {}
