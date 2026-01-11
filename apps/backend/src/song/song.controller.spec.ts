import type { UserDocument } from '@nbw/database';
import {
  PageQueryDTO,
  SongPreviewDto,
  SongViewDto,
  UploadSongDto,
  UploadSongResponseDto,
  PageDto,
  SongListQueryDTO,
  SongSortType,
  FeaturedSongsDto,
} from '@nbw/database';
import {
  BadRequestException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { FileService } from '../file/file.service';

import { SongController } from './song.controller';
import { SongService } from './song.service';

const mockSongService = {
  getSongByPage: jest.fn(),
  querySongs: jest.fn(),
  getSong: jest.fn(),
  getSongEdit: jest.fn(),
  patchSong: jest.fn(),
  getSongDownloadUrl: jest.fn(),
  deleteSong: jest.fn(),
  uploadSong: jest.fn(),
  getRandomSongs: jest.fn(),
  getSongsForTimespan: jest.fn(),
  getSongsBeforeTimespan: jest.fn(),
  getCategories: jest.fn(),
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

    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(songController).toBeDefined();
  });

  describe('getSongList', () => {
    it('should return a paginated list of songs (default)', async () => {
      const query: SongListQueryDTO = { page: 1, limit: 10 };
      const songList: SongPreviewDto[] = [];

      mockSongService.getSongByPage.mockResolvedValueOnce(songList);

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toEqual(songList);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(0);
      expect(songService.getSongByPage).toHaveBeenCalled();
    });

    it('should handle search query', async () => {
      const query: SongListQueryDTO = { page: 1, limit: 10, q: 'test search' };
      const songList: SongPreviewDto[] = [];

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 0,
      });

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toEqual(songList);
      expect(result.total).toBe(0);
      expect(songService.querySongs).toHaveBeenCalled();
    });

    it('should handle random sort', async () => {
      const query: SongListQueryDTO = {
        page: 1,
        limit: 5,
        sort: SongSortType.RANDOM,
      };
      const songList: SongPreviewDto[] = [];

      mockSongService.getRandomSongs.mockResolvedValueOnce(songList);

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toEqual(songList);
      expect(songService.getRandomSongs).toHaveBeenCalledWith(5, undefined);
    });

    it('should handle random sort with category', async () => {
      const query: SongListQueryDTO = {
        page: 1,
        limit: 5,
        sort: SongSortType.RANDOM,
        category: 'electronic',
      };
      const songList: SongPreviewDto[] = [];

      mockSongService.getRandomSongs.mockResolvedValueOnce(songList);

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toEqual(songList);
      expect(songService.getRandomSongs).toHaveBeenCalledWith(5, 'electronic');
    });

    it('should throw error for invalid random limit', async () => {
      const query: SongListQueryDTO = {
        page: 1,
        limit: 15,
        sort: SongSortType.RANDOM,
      };

      await expect(songController.getSongList(query)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle recent sort', async () => {
      const query: SongListQueryDTO = {
        page: 1,
        limit: 10,
        sort: SongSortType.RECENT,
      };
      const songList: SongPreviewDto[] = [];

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 0,
      });

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toEqual(songList);
      expect(result.total).toBe(0);
      expect(songService.querySongs).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          sort: 'createdAt',
          order: true,
        }),
        undefined,
        undefined,
      );
    });

    it('should handle recent sort with category', async () => {
      const query: SongListQueryDTO = {
        page: 1,
        limit: 10,
        sort: SongSortType.RECENT,
        category: 'pop',
      };
      const songList: SongPreviewDto[] = [];

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 0,
      });

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toEqual(songList);
      expect(result.total).toBe(0);
      expect(songService.querySongs).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          sort: 'createdAt',
          order: true,
        }),
        undefined,
        'pop',
      );
    });

    it('should handle category filter', async () => {
      const query: SongListQueryDTO = {
        page: 1,
        limit: 10,
        category: 'rock',
      };
      const songList: SongPreviewDto[] = [];

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 0,
      });

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toEqual(songList);
      expect(result.total).toBe(0);
      expect(songService.querySongs).toHaveBeenCalled();
    });

    it('should return correct total when total exceeds limit', async () => {
      const query: SongListQueryDTO = { page: 1, limit: 10 };
      const songList: SongPreviewDto[] = Array(10)
        .fill(null)
        .map((_, i) => ({ id: `song-${i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 150,
      });

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(10);
      expect(result.total).toBe(150);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should return correct total when total is less than limit', async () => {
      const query: SongListQueryDTO = { page: 1, limit: 10 };
      const songList: SongPreviewDto[] = Array(5)
        .fill(null)
        .map((_, i) => ({ id: `song-${i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 5,
      });

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(5);
      expect(result.total).toBe(5);
    });

    it('should return correct total on later pages', async () => {
      const query: SongListQueryDTO = { page: 3, limit: 10 };
      const songList: SongPreviewDto[] = Array(10)
        .fill(null)
        .map((_, i) => ({ id: `song-${20 + i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 3,
        limit: 10,
        total: 25,
      });

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(10);
      expect(result.total).toBe(25);
      expect(result.page).toBe(3);
    });

    it('should handle search query with total count', async () => {
      const query: SongListQueryDTO = { page: 1, limit: 10, q: 'test search' };
      const songList: SongPreviewDto[] = Array(8)
        .fill(null)
        .map((_, i) => ({ id: `song-${i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 8,
      });

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(8);
      expect(result.total).toBe(8);
      expect(songService.querySongs).toHaveBeenCalled();
    });

    it('should handle category filter with total count', async () => {
      const query: SongListQueryDTO = {
        page: 1,
        limit: 10,
        category: 'rock',
      };
      const songList: SongPreviewDto[] = Array(3)
        .fill(null)
        .map((_, i) => ({ id: `rock-song-${i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 3,
      });

      const result = await songController.getSongList(query);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(songService.querySongs).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const query: SongListQueryDTO = { page: 1, limit: 10 };

      mockSongService.getSongByPage.mockRejectedValueOnce(new Error('Error'));

      await expect(songController.getSongList(query)).rejects.toThrow('Error');
    });
  });

  describe('getFeaturedSongs', () => {
    it('should return featured songs', async () => {
      const songList: SongPreviewDto[] = [];

      mockSongService.getSongsForTimespan.mockResolvedValue(songList);
      mockSongService.getSongsBeforeTimespan.mockResolvedValue([]);

      const result = await songController.getFeaturedSongs();

      expect(result).toHaveProperty('hour');
      expect(result).toHaveProperty('day');
      expect(result).toHaveProperty('week');
      expect(result).toHaveProperty('month');
      expect(result).toHaveProperty('year');
      expect(result).toHaveProperty('all');
      expect(result.hour).toEqual([]);
      expect(result.day).toEqual([]);
      expect(result.week).toEqual([]);
      expect(result.month).toEqual([]);
      expect(result.year).toEqual([]);
      expect(result.all).toEqual([]);
      expect(songService.getSongsForTimespan).toHaveBeenCalledTimes(6);
    });

    it('should handle errors', async () => {
      mockSongService.getSongsForTimespan.mockRejectedValueOnce(
        new Error('Error'),
      );

      await expect(songController.getFeaturedSongs()).rejects.toThrow('Error');
    });
  });

  describe('getCategories', () => {
    it('should return categories with counts', async () => {
      const categories = { pop: 42, rock: 38 };

      mockSongService.getCategories.mockResolvedValueOnce(categories);

      const result = await songController.getCategories();

      expect(result).toEqual(categories);
      expect(songService.getCategories).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockSongService.getCategories.mockRejectedValueOnce(new Error('Error'));

      await expect(songController.getCategories()).rejects.toThrow('Error');
    });
  });

  describe('searchSongs', () => {
    it('should return paginated search results with query', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const q = 'test query';
      const songList: SongPreviewDto[] = Array(5)
        .fill(null)
        .map((_, i) => ({ id: `song-${i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 5,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(5);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(songService.querySongs).toHaveBeenCalledWith(query, q, undefined);
    });

    it('should handle search with empty query string', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const q = '';
      const songList: SongPreviewDto[] = [];

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 0,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toEqual(songList);
      expect(result.total).toBe(0);
      expect(songService.querySongs).toHaveBeenCalledWith(query, '', undefined);
    });

    it('should handle search with null query string', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const q = null as any;
      const songList: SongPreviewDto[] = [];

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 0,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toEqual(songList);
      expect(songService.querySongs).toHaveBeenCalledWith(query, '', undefined);
    });

    it('should handle search with multiple pages', async () => {
      const query: PageQueryDTO = { page: 2, limit: 10 };
      const q = 'test search';
      const songList: SongPreviewDto[] = Array(10)
        .fill(null)
        .map((_, i) => ({ id: `song-${10 + i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 2,
        limit: 10,
        total: 25,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(10);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(songService.querySongs).toHaveBeenCalledWith(query, q, undefined);
    });

    it('should handle search with large result set', async () => {
      const query: PageQueryDTO = { page: 1, limit: 50 };
      const q = 'popular song';
      const songList: SongPreviewDto[] = Array(50)
        .fill(null)
        .map((_, i) => ({ id: `song-${i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 50,
        total: 500,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(50);
      expect(result.total).toBe(500);
      expect(songService.querySongs).toHaveBeenCalledWith(query, q, undefined);
    });

    it('should handle search on last page with partial results', async () => {
      const query: PageQueryDTO = { page: 5, limit: 10 };
      const q = 'search term';
      const songList: SongPreviewDto[] = Array(3)
        .fill(null)
        .map((_, i) => ({ id: `song-${40 + i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 5,
        limit: 10,
        total: 43,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(3);
      expect(result.total).toBe(43);
      expect(result.page).toBe(5);
    });

    it('should handle search with special characters', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const q = 'test@#$%^&*()';
      const songList: SongPreviewDto[] = [];

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 0,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(songService.querySongs).toHaveBeenCalledWith(query, q, undefined);
    });

    it('should handle search with very long query string', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const q = 'a'.repeat(500);
      const songList: SongPreviewDto[] = [];

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 0,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(songService.querySongs).toHaveBeenCalledWith(query, q, undefined);
    });

    it('should handle search with custom limit', async () => {
      const query: PageQueryDTO = { page: 1, limit: 25 };
      const q = 'test';
      const songList: SongPreviewDto[] = Array(25)
        .fill(null)
        .map((_, i) => ({ id: `song-${i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 25,
        total: 100,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(25);
      expect(result.limit).toBe(25);
      expect(result.total).toBe(100);
    });

    it('should handle search with sorting parameters', async () => {
      const query: PageQueryDTO = {
        page: 1,
        limit: 10,
        sort: 'playCount',
        order: false,
      };
      const q = 'trending';
      const songList: SongPreviewDto[] = Array(10)
        .fill(null)
        .map((_, i) => ({ id: `song-${i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 100,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(10);
      expect(songService.querySongs).toHaveBeenCalledWith(query, q, undefined);
    });

    it('should return correct pagination info with search results', async () => {
      const query: PageQueryDTO = { page: 3, limit: 20 };
      const q = 'search';
      const songList: SongPreviewDto[] = Array(20)
        .fill(null)
        .map((_, i) => ({ id: `song-${40 + i}` } as unknown as SongPreviewDto));

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 3,
        limit: 20,
        total: 250,
      });

      const result = await songController.searchSongs(query, q);

      expect(result.page).toBe(3);
      expect(result.limit).toBe(20);
      expect(result.total).toBe(250);
      expect(result.content).toHaveLength(20);
    });

    it('should handle search with no results', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const q = 'nonexistent song title xyz';
      const songList: SongPreviewDto[] = [];

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 0,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(result.content).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle search errors', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const q = 'test query';

      mockSongService.querySongs.mockRejectedValueOnce(
        new Error('Database error'),
      );

      await expect(songController.searchSongs(query, q)).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle search with whitespace-only query', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const q = '   ';
      const songList: SongPreviewDto[] = [];

      mockSongService.querySongs.mockResolvedValueOnce({
        content: songList,
        page: 1,
        limit: 10,
        total: 0,
      });

      const result = await songController.searchSongs(query, q);

      expect(result).toBeInstanceOf(PageDto);
      expect(songService.querySongs).toHaveBeenCalledWith(query, q, undefined);
    });
  });

  describe('getSong', () => {
    it('should return song info by ID', async () => {
      const id = 'test-id';
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;
      const song: SongViewDto = {} as SongViewDto;

      mockSongService.getSong.mockResolvedValueOnce(song);

      const result = await songController.getSong(id, user);

      expect(result).toEqual(song);
      expect(songService.getSong).toHaveBeenCalledWith(id, user);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;

      mockSongService.getSong.mockRejectedValueOnce(new Error('Error'));

      await expect(songController.getSong(id, user)).rejects.toThrow('Error');
    });
  });

  describe('getEditSong', () => {
    it('should return song info for editing by ID', async () => {
      const id = 'test-id';
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;
      const song: UploadSongDto = {} as UploadSongDto;

      mockSongService.getSongEdit.mockResolvedValueOnce(song);

      const result = await songController.getEditSong(id, user);

      expect(result).toEqual(song);
      expect(songService.getSongEdit).toHaveBeenCalledWith(id, user);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;

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
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;
      const response: UploadSongResponseDto = {} as UploadSongResponseDto;

      mockSongService.patchSong.mockResolvedValueOnce(response);

      const result = await songController.patchSong(id, req, user);

      expect(result).toEqual(response);
      expect(songService.patchSong).toHaveBeenCalledWith(id, req.body, user);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const req = { body: {} } as any;
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;

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
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;

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
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;

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
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;
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
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;
      const src = 'invalid-src';

      await expect(
        songController.getSongOpenUrl(id, user, src),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;
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
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;

      mockSongService.deleteSong.mockResolvedValueOnce(undefined);

      await songController.deleteSong(id, user);

      expect(songService.deleteSong).toHaveBeenCalledWith(id, user);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;

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

      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;
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

      const user: UserDocument = {
        _id: 'test-user-id',
      } as unknown as UserDocument;

      mockSongService.uploadSong.mockRejectedValueOnce(new Error('Error'));

      await expect(songController.createSong(file, body, user)).rejects.toThrow(
        'Error',
      );
    });
  });
});
