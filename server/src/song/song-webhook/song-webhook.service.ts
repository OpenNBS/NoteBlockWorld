import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Song as SongEntity, SongWithUser } from '../entity/song.entity';
import { getUploadDiscordEmbed } from '../song.util';

@Injectable()
export class SongWebhookService implements OnModuleInit {
  private logger = new Logger(SongWebhookService.name);

  constructor(
    @InjectModel(SongEntity.name)
    private songModel: Model<SongEntity>,
  ) {}

  async onModuleInit() {
    this.logger.log('Updating Discord webhooks for all songs');
    await this.syncAllSongsWebhook();
  }

  public async postSongWebhook(song: SongWithUser): Promise<string | null> {
    /**
     * Posts a new webhook message for a song.
     *
     * @param {SongWithUser} song The song document to post the webhook message for.
     * @returns {Promise<string | null>} A promise that resolves with the new message ID, or `null` if there was an error.
     * @throws {Error} If the Discord webhook URL is not found.
     * @throws {Error} If there is an error sending the webhook message.
     */
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      this.logger.error('Discord webhook URL not found');
      return null;
    }

    const webhookData = getUploadDiscordEmbed(song);

    try {
      const response = await fetch(`${webhookUrl}?wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      const data = await response.json();

      this.logger.log(`Posted webhook message for song ${song.publicId}`);
      return data.id; // Discord message ID
    } catch (e) {
      this.logger.error('Error sending Discord webhook', e);
      return null;
    }
  }

  public async updateSongWebhook(song: SongWithUser) {
    /**
     * Updates the webhook message for a song.
     *
     * @param {SongWithUser} song The song document to update the webhook message for.
     * @returns {Promise<void>} A promise that resolves when the message has been updated.
     * @throws {Error} If the song does not have a webhook message.
     * @throws {Error} If the Discord webhook URL is not found.
     * @throws {Error} If there is an error updating the webhook message.
     */

    if (!song.webhookMessageId) {
      throw new Error('Song does not have a webhook message');
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      this.logger.error('Discord webhook URL not found');
      return;
    }

    const webhookData = getUploadDiscordEmbed(song);

    try {
      await fetch(`${webhookUrl}/messages/${song.webhookMessageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      this.logger.log(`Updated webhook message for song ${song.publicId}`);
    } catch (e) {
      this.logger.error('Error updating Discord webhook', e);
    }
  }

  public async deleteSongWebhook(song: SongWithUser) {
    /**
     * Deletes the webhook message for a song.
     *
     * @param {SongWithUser} song The song document to delete the webhook message for.
     * @returns {Promise<void>} A promise that resolves when the message has been deleted.
     * @throws {Error} If the song does not have a webhook message.
     * @throws {Error} If the Discord webhook URL is not found.
     * @throws {Error} If there is an error deleting the webhook message.
     *
     */
    if (!song.webhookMessageId) {
      throw new Error('Song does not have a webhook message');
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      this.logger.error('Discord webhook URL not found');
      return;
    }

    try {
      await fetch(`${webhookUrl}/messages/${song.webhookMessageId}`, {
        method: 'DELETE',
      });

      this.logger.log(`Deleted webhook message for song ${song.publicId}`);
    } catch (e) {
      this.logger.error('Error deleting Discord webhook', e);
    }
  }

  public async syncSongWebhook(song: SongWithUser) {
    /**
     * Synchronizes the webhook message for a song.
     *
     * If the song is public and has a message, it updates the existing message.
     * If the song is public and does not have a message, it posts a new message.
     * If the song is not public and has a message, it deletes the existing message.
     *
     * @param {SongWithUser} song The song document to synchronize.
     * @returns {Promise<string | null>} A promise that resolves with the new or updated message ID, or null if the message was deleted.
     */

    if (song.webhookMessageId) {
      // Update existing message
      if (song.visibility === 'public') {
        await this.updateSongWebhook(song);
        return song.webhookMessageId;
      } else {
        await this.deleteSongWebhook(song);
        return null;
      }
    } else {
      // Post new message
      if (song.visibility === 'public') {
        const newMessageId = await this.postSongWebhook(song);
        return newMessageId;
      } else {
        return null;
      }
    }
  }

  private async syncAllSongsWebhook() {
    /**
     * Synchronizes the webhook messages for all songs in the database.
     *
     * This method retrieves all songs from the database and checks if they have a webhook message ID.
     * If a song does not have a webhook message ID, it calls the `syncSongWebhook` method to generate one
     * and then saves the updated song document back to the database.
     *
     * @returns {Promise<void>} A promise that resolves when all songs have been processed.
     */
    const songQuery = this.songModel
      .find({})
      .sort({ createdAt: -1 })
      .populate('uploader', 'username profileImage -_id');

    for await (const songDocument of songQuery) {
      const webhookMessageId = await this.syncSongWebhook(
        songDocument as unknown as SongWithUser,
      );

      songDocument.webhookMessageId = webhookMessageId;
      await songDocument.save();
    }
  }
}
