import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { SongViewDto } from '@shared/validation/song/dto/SongView.dto';
import { UploadSongDto } from '@shared/validation/song/dto/UploadSongDto.dto';
import { UploadSongResponseDto } from '@shared/validation/song/dto/UploadSongResponseDto.dto';
import { Response } from 'express';

import { FileService } from '@server/file/file.service';
import { UserDocument } from '@server/user/entity/user.entity';

import { SongController } from './song.controller';
import { SongService } from './song.service';

const mockSongService = {
  getSongByPage: jest.fn(),
  getSong: jest.fn(),
  getSongEdit: jest.fn(),
  patchSong: jest.fn(),
  getSongDownloadUrl: jest.fn(),
  deleteSong: jest.fn(),
  uploadSong: jest.fn(),
};

const mockFileService = {};

describe('SongController', () => {
  let songController: SongController;
  let songService: SongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongController],
      providers: [
        {
          provide: SongService,
          useValue: mockSongService,
        },
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt-refresh'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    songController = module.get<SongController>(SongController);
    songService = module.get<SongService>(SongService);
  });

  it('should be defined', () => {
    expect(songController).toBeDefined();
  });

  describe('getSongList', () => {
    it('should return a list of songs', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const songList: SongPreviewDto[] = [];

      mockSongService.getSongByPage.mockResolvedValueOnce(songList);

      const result = await songController.getSongList(query);

      expect(result).toEqual(songList);
      expect(songService.getSongByPage).toHaveBeenCalledWith(query);
    });

    it('should handle errors', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };

      mockSongService.getSongByPage.mockRejectedValueOnce(new Error('Error'));

      await expect(songController.getSongList(query)).rejects.toThrow('Error');
    });
  });

  describe('getSong', () => {
    it('should return song info by ID', async () => {
      const id = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const song: SongViewDto = {} as SongViewDto;

      mockSongService.getSong.mockResolvedValueOnce(song);

      const result = await songController.getSong(id, user);

      expect(result).toEqual(song);
      expect(songService.getSong).toHaveBeenCalledWith(id, user);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      mockSongService.getSong.mockRejectedValueOnce(new Error('Error'));

      await expect(songController.getSong(id, user)).rejects.toThrow('Error');
    });
  });

  describe('getEditSong', () => {
    it('should return song info for editing by ID', async () => {
      const id = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const song: UploadSongDto = {} as UploadSongDto;

      mockSongService.getSongEdit.mockResolvedValueOnce(song);

      const result = await songController.getEditSong(id, user);

      expect(result).toEqual(song);
      expect(songService.getSongEdit).toHaveBeenCalledWith(id, user);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      mockSongService.getSongEdit.mockRejectedValueOnce(new Error('Error'));

      await expect(songController.getEditSong(id, user)).rejects.toThrow(
        'Error',
      );
    });
  });

  describe('patchSong', () => {
    it('should edit song info by ID', async () => {
      const id = 'test-id';
      const req = { body: {} } as any;
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const response: UploadSongResponseDto = {} as UploadSongResponseDto;

      mockSongService.patchSong.mockResolvedValueOnce(response);

      const result = await songController.patchSong(id, req, user);

      expect(result).toEqual(response);
      expect(songService.patchSong).toHaveBeenCalledWith(id, req.body, user);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const req = { body: {} } as any;
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      mockSongService.patchSong.mockRejectedValueOnce(new Error('Error'));

      await expect(songController.patchSong(id, req, user)).rejects.toThrow(
        'Error',
      );
    });
  });

  describe('getSongFile', () => {
    it('should get song .nbs file', async () => {
      const id = 'test-id';
      const src = 'test-src';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const res = {
        set: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;

      const url = 'test-url';

      mockSongService.getSongDownloadUrl.mockResolvedValueOnce(url);

      await songController.getSongFile(id, src, user, res);

      expect(res.set).toHaveBeenCalledWith({
        'Content-Disposition': 'attachment; filename="song.nbs"',
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });

      expect(res.redirect).toHaveBeenCalledWith(HttpStatus.FOUND, url);

      expect(songService.getSongDownloadUrl).toHaveBeenCalledWith(
        id,
        user,
        src,
        false,
      );
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const src = 'test-src';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const res = {
        set: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;

      mockSongService.getSongDownloadUrl.mockRejectedValueOnce(
        new Error('Error'),
      );

      await expect(
        songController.getSongFile(id, src, user, res),
      ).rejects.toThrow('Error');
    });
  });

  describe('getSongOpenUrl', () => {
    it('should get song .nbs file open URL', async () => {
      const id = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const src = 'downloadButton';
      const url = 'test-url';

      mockSongService.getSongDownloadUrl.mockResolvedValueOnce(url);

      const result = await songController.getSongOpenUrl(id, user, src);

      expect(result).toEqual(url);

      expect(songService.getSongDownloadUrl).toHaveBeenCalledWith(
        id,
        user,
        'open',
        true,
      );
    });

    it('should throw UnauthorizedException if src is invalid', async () => {
      const id = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const src = 'invalid-src';

      await expect(
        songController.getSongOpenUrl(id, user, src),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const src = 'downloadButton';

      mockSongService.getSongDownloadUrl.mockRejectedValueOnce(
        new Error('Error'),
      );

      await expect(
        songController.getSongOpenUrl(id, user, src),
      ).rejects.toThrow('Error');
    });
  });

  describe('deleteSong', () => {
    it('should delete a song', async () => {
      const id = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      mockSongService.deleteSong.mockResolvedValueOnce(undefined);

      await songController.deleteSong(id, user);

      expect(songService.deleteSong).toHaveBeenCalledWith(id, user);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      mockSongService.deleteSong.mockRejectedValueOnce(new Error('Error'));

      await expect(songController.deleteSong(id, user)).rejects.toThrow(
        'Error',
      );
    });
  });

  describe('createSong', () => {
    it('should upload a song', async () => {
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;

      const body: UploadSongDto = {
        title: 'Test Song',
        originalAuthor: 'Test Author',
        description: 'Test Description',
        category: 'alternative',
        visibility: 'public',
        license: 'cc_by_sa',
        customInstruments: [],
        thumbnailData: {
          startTick: 0,
          startLayer: 0,
          zoomLevel: 1,
          backgroundColor: '#000000',
        },
        file: undefined,
        allowDownload: false,
      };

      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const response: UploadSongResponseDto = {} as UploadSongResponseDto;

      mockSongService.uploadSong.mockResolvedValueOnce(response);

      const result = await songController.createSong(file, body, user);

      expect(result).toEqual(response);
      expect(songService.uploadSong).toHaveBeenCalledWith({ body, file, user });
    });

    it('should handle errors', async () => {
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;

      const body: UploadSongDto = {
        title: 'Test Song',
        originalAuthor: 'Test Author',
        description: 'Test Description',
        category: 'alternative',
        visibility: 'public',
        license: 'cc_by_sa',
        customInstruments: [],
        thumbnailData: {
          startTick: 0,
          startLayer: 0,
          zoomLevel: 1,
          backgroundColor: '#000000',
        },
        file: undefined,
        allowDownload: false,
      };

      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      mockSongService.uploadSong.mockRejectedValueOnce(new Error('Error'));

      await expect(songController.createSong(file, body, user)).rejects.toThrow(
        'Error',
      );
    });
  });
});
