import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Song, SongSchema } from '@nbw/database';

import { MigrationService } from './migration.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
  ],
  providers: [MigrationService],
  exports: [MigrationService],
})
export class MigrationModule {}
