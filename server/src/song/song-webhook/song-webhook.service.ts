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
    await this.updateAllSongsWebhook();
  }

  public async postDiscordWebhook(song: SongWithUser) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      this.logger.error('Discord webhook URL not found');
      return;
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
      return data.id; // Discord message ID
    } catch (e) {
      this.logger.error('Error sending Discord webhook', e);
      return;
    }
  }

  public async updateAllSongsWebhook() {
    const songQuery = this.songModel
      .find({})
      .populate('uploader', 'username profileImage -_id');

    for await (const songDocument of songQuery) {
      if (songDocument.webhookMessageId === undefined) {
        if (songDocument.visibility === 'public') {
          try {
            const webhookMessageId = await this.postDiscordWebhook(
              songDocument as unknown as SongWithUser,
            );

            songDocument.webhookMessageId = webhookMessageId;
          } catch (e) {
            this.logger.error(
              `Error updating Discord webhook for song ${songDocument.publicId}`,
            );

            songDocument.webhookMessageId = null;
          }
        } else {
          songDocument.webhookMessageId = null;
        }
      }

      songDocument.save();
    }
  }
}
