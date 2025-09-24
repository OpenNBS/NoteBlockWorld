import { Module } from '@nestjs/common';

import { SongModule } from '@server/song/song.module';

import { SongBrowserController } from './song-browser.controller';
import { SongBrowserService } from './song-browser.service';

@Module({
    providers  : [SongBrowserService],
    controllers: [SongBrowserController],
    imports    : [SongModule]
})
export class SongBrowserModule {}
