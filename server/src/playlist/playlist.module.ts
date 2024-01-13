import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';

@Module({
  providers: [PlaylistService],
  controllers: [PlaylistController]
})
export class PlaylistModule {}
