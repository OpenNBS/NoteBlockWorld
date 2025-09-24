import { beforeEach, describe, expect, it, jest, mock, spyOn } from 'bun:test';

import { Song as SongEntity, SongWithUser } from '@nbw/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { getUploadDiscordEmbed } from '../song.util';

import { SongWebhookService } from './song-webhook.service';

mock.module('../song.util', () => ({
  getUploadDiscordEmbed: jest.fn()
}));

const mockSongModel = {
  find    : jest.fn().mockReturnThis(),
  sort    : jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  save    : jest.fn()
};

describe('SongWebhookService', () => {
  let service: SongWebhookService;
  let _songModel: Model<SongEntity>;
  let _configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports  : [ConfigModule.forRoot()],
      providers: [
        SongWebhookService,
        {
          provide : getModelToken(SongEntity.name),
          useValue: mockSongModel
        },
        {
          provide : 'DISCORD_WEBHOOK_URL',
          useValue: 'http://localhost/webhook'
        }
      ]
    }).compile();

    service = module.get<SongWebhookService>(SongWebhookService);
    _songModel = module.get<Model<SongEntity>>(getModelToken(SongEntity.name));
    _configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('postSongWebhook', () => {
    it('should post a new webhook message for a song', async () => {
      const song: SongWithUser = {
        publicId: '123',
        uploader: { username: 'testuser', profileImage: 'testimage' }
      } as SongWithUser;

      (getUploadDiscordEmbed as jest.Mock).mockReturnValue({});

      (global as any).fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ id: 'message-id' })
      });

      const result = await service.postSongWebhook(song);

      expect(result).toBe('message-id');

      expect(fetch).toHaveBeenCalledWith('http://localhost/webhook?wait=true', {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
    });

    it('should return null if there is an error', async () => {
      const song: SongWithUser = {
        publicId: '123',
        uploader: { username: 'testuser', profileImage: 'testimage' }
      } as SongWithUser;

      (getUploadDiscordEmbed as jest.Mock).mockReturnValue({});

      (global as any).fetch = jest.fn().mockRejectedValue(new Error('Error'));

      const result = await service.postSongWebhook(song);

      expect(result).toBeNull();
    });
  });

  describe('updateSongWebhook', () => {
    it('should update the webhook message for a song', async () => {
      const song: SongWithUser = {
        publicId        : '123',
        webhookMessageId: 'message-id',
        uploader        : { username: 'testuser', profileImage: 'testimage' }
      } as SongWithUser;

      (getUploadDiscordEmbed as jest.Mock).mockReturnValue({});

      (global as any).fetch = jest.fn().mockResolvedValue({});

      await service.updateSongWebhook(song);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost/webhook/messages/message-id',
        {
          method : 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        }
      );
    });

    it('should log an error if there is an error', async () => {
      const song: SongWithUser = {
        publicId        : '123',
        webhookMessageId: 'message-id',
        uploader        : { username: 'testuser', profileImage: 'testimage' }
      } as SongWithUser;

      (getUploadDiscordEmbed as jest.Mock).mockReturnValue({});

      (global as any).fetch = jest.fn().mockRejectedValue(new Error('Error'));

      const loggerSpy = spyOn(service['logger'], 'error');

      await service.updateSongWebhook(song);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error updating Discord webhook',
        expect.any(Error)
      );
    });
  });

  describe('deleteSongWebhook', () => {
    it('should delete the webhook message for a song', async () => {
      const song: SongWithUser = {
        publicId        : '123',
        webhookMessageId: 'message-id',
        uploader        : { username: 'testuser', profileImage: 'testimage' }
      } as SongWithUser;

      (global as any).fetch = jest.fn().mockResolvedValue({});

      await service.deleteSongWebhook(song);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost/webhook/messages/message-id',
        {
          method: 'DELETE'
        }
      );
    });

    it('should log an error if there is an error', async () => {
      const song: SongWithUser = {
        publicId        : '123',
        webhookMessageId: 'message-id',
        uploader        : { username: 'testuser', profileImage: 'testimage' }
      } as SongWithUser;

      (global as any).fetch = jest.fn().mockRejectedValue(new Error('Error'));

      const loggerSpy = spyOn(service['logger'], 'error');

      await service.deleteSongWebhook(song);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error deleting Discord webhook',
        expect.any(Error)
      );
    });
  });

  describe('syncSongWebhook', () => {
    it('should update the webhook message if the song is public', async () => {
      const song: SongWithUser = {
        publicId        : '123',
        webhookMessageId: 'message-id',
        visibility      : 'public',
        uploader        : { username: 'testuser', profileImage: 'testimage' }
      } as SongWithUser;

      const updateSpy = spyOn(service, 'updateSongWebhook');

      await service.syncSongWebhook(song);

      expect(updateSpy).toHaveBeenCalledWith(song);
    });

    it('should delete the webhook message if the song is not public', async () => {
      const song: SongWithUser = {
        publicId        : '123',
        webhookMessageId: 'message-id',
        visibility      : 'private',
        uploader        : { username: 'testuser', profileImage: 'testimage' }
      } as SongWithUser;

      const deleteSpy = spyOn(service, 'deleteSongWebhook');

      await service.syncSongWebhook(song);

      expect(deleteSpy).toHaveBeenCalledWith(song);
    });

    it('should post a new webhook message if the song is public and does not have a message', async () => {
      const song: SongWithUser = {
        publicId  : '123',
        visibility: 'public',
        uploader  : { username: 'testuser', profileImage: 'testimage' }
      } as SongWithUser;

      const postSpy = spyOn(service, 'postSongWebhook');

      await service.syncSongWebhook(song);

      expect(postSpy).toHaveBeenCalledWith(song);
    });

    it('should return null if the song is not public and does not have a message', async () => {
      const song: SongWithUser = {
        publicId  : '123',
        visibility: 'private',
        uploader  : { username: 'testuser', profileImage: 'testimage' }
      } as SongWithUser;

      const result = await service.syncSongWebhook(song);

      expect(result).toBeNull();
    });
  });

  describe('syncAllSongsWebhook', () => {
    it('should synchronize the webhook messages for all songs', async () => {
      const songs: SongWithUser[] = [
        {
          publicId: '123',
          uploader: { username: 'testuser', profileImage: 'testimage' },
          save    : jest.fn()
        } as unknown as SongWithUser
      ];

      mockSongModel.find.mockReturnValue({
        sort    : jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(songs)
      });

      const syncSpy = spyOn(service, 'syncSongWebhook');

      await (service as any).syncAllSongsWebhook();

      expect(syncSpy).toHaveBeenCalledWith(songs[0]);
    });
  });
});
