import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TypesenseService } from '@server/typesense/typesense.service';
import { Model } from 'mongoose';

import { Song as SongEntity, SongPreviewDto } from '@nbw/database';
import type { SongWithUser } from '@nbw/database';

@Injectable()
export class SongIndexingService {
  private readonly logger = new Logger(SongIndexingService.name);
  private readonly batchSize = 50;

  constructor(
    @InjectModel(SongEntity.name)
    private songModel: Model<SongEntity>,
    private typesenseService: TypesenseService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async indexUnindexedSongs() {
    try {
      this.logger.log('Starting batch indexing of unindexed songs...');

      // Find songs that are not indexed and are public
      const unindexedSongs = await this.songModel
        .find({
          $or: [
            { searchIndexed: false },
            { searchIndexed: { $exists: false } },
            { searchIndexed: null },
          ],
          visibility: 'public', // Exclude private songs
        })
        .limit(this.batchSize)
        .populate('uploader', 'username displayName profileImage -_id')
        .lean() // Use lean() to get plain JavaScript objects
        .exec();

      if (unindexedSongs.length === 0) {
        this.logger.log('No unindexed songs found');
        return;
      }

      this.logger.log(`Found ${unindexedSongs.length} unindexed songs`);

      // Debug: Log first song to see what fields are present
      if (unindexedSongs.length > 0) {
        const firstSong = unindexedSongs[0];
        this.logger.debug(
          `First song sample - Has stats: ${!!firstSong.stats}, Has uploader: ${!!firstSong.uploader}`,
        );
        if (firstSong.stats) {
          this.logger.debug(
            `Stats sample - duration: ${firstSong.stats.duration}, noteCount: ${firstSong.stats.noteCount}`,
          );
        }
      }

      // Convert to SongPreviewDto format, filtering out songs with missing data
      const songPreviews = unindexedSongs
        .filter((song) => {
          if (!song.stats) {
            this.logger.warn(
              `Song ${song.publicId} has no stats field, skipping indexing`,
            );
            return false;
          }
          if (!song.stats.duration || !song.stats.noteCount) {
            this.logger.warn(
              `Song ${song.publicId} has incomplete stats, skipping indexing`,
            );
            return false;
          }
          return true;
        })
        .map((song) => {
          const songWithUser = song as unknown as SongWithUser;
          return SongPreviewDto.fromSongDocumentWithUser(songWithUser);
        });

      if (songPreviews.length === 0) {
        this.logger.warn('No valid songs to index after filtering');
        return;
      }

      // Index songs in Typesense
      await this.typesenseService.indexSongs(songPreviews);

      // Mark only the successfully indexed songs
      const indexedSongIds = unindexedSongs
        .filter(
          (song) => song.stats && song.stats.duration && song.stats.noteCount,
        )
        .map((song) => song._id);

      await this.songModel.updateMany(
        { _id: { $in: indexedSongIds } },
        { $set: { searchIndexed: true } },
      );

      this.logger.log(`Successfully indexed ${songPreviews.length} songs`);
    } catch (error) {
      this.logger.error('Error during batch indexing:', error);
    }
  }

  /**
   * Manually trigger indexing of all songs
   * This is useful for initial setup or reindexing
   */
  async reindexAllSongs() {
    this.logger.log('Starting full reindex of all songs...');

    try {
      // Reset searchIndexed flag for all public songs
      await this.songModel.updateMany(
        { visibility: 'public' },
        { $set: { searchIndexed: false } },
      );

      this.logger.log('Reset searchIndexed flag for all public songs');

      // Recreate the collection in Typesense
      await this.typesenseService.recreateCollection();

      this.logger.log('Recreated Typesense collection');

      // Index songs in batches
      let processedCount = 0;
      let hasMore = true;

      while (hasMore) {
        const songs = await this.songModel
          .find({
            visibility: 'public',
            searchIndexed: false,
          })
          .limit(this.batchSize)
          .populate('uploader', 'username displayName profileImage -_id')
          .lean()
          .exec();

        if (songs.length === 0) {
          hasMore = false;
          break;
        }

        const songPreviews = songs
          .filter((song) => {
            if (!song.stats) {
              this.logger.warn(
                `Song ${song.publicId} has no stats field, skipping indexing`,
              );
              return false;
            }
            if (!song.stats.duration || !song.stats.noteCount) {
              this.logger.warn(
                `Song ${song.publicId} has incomplete stats, skipping indexing`,
              );
              return false;
            }
            return true;
          })
          .map((song) => {
            const songWithUser = song as unknown as SongWithUser;
            return SongPreviewDto.fromSongDocumentWithUser(songWithUser);
          });

        if (songPreviews.length === 0) {
          this.logger.warn('No valid songs to index in this batch');
          continue;
        }

        await this.typesenseService.indexSongs(songPreviews);

        // Mark only the successfully indexed songs
        const indexedSongIds = songs
          .filter(
            (song) => song.stats && song.stats.duration && song.stats.noteCount,
          )
          .map((song) => song._id);

        await this.songModel.updateMany(
          { _id: { $in: indexedSongIds } },
          { $set: { searchIndexed: true } },
        );

        processedCount += songPreviews.length;
        this.logger.log(`Indexed ${processedCount} songs so far...`);
      }

      this.logger.log(
        `Full reindex complete. Total songs indexed: ${processedCount}`,
      );
    } catch (error) {
      this.logger.error('Error during full reindex:', error);
      throw error;
    }
  }
}
