import { Module } from '@nestjs/common';

import { SongModule } from '@server/song/song.module';

import { SongBrowserController } from './song-browser.controller';

@Module({
  providers: [],
  controllers: [SongBrowserController],
  imports: [SongModule],
})
export class SongBrowserModule {}
