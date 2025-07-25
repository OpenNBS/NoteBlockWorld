import { PageQueryDTO, SongPreviewDto, SongWithUser } from '@nbw/database';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SongService } from '@server/song/song.service';
import { SongBrowserService } from './song-browser.service';

const mockSongService = {
  getSongsForTimespan: jest.fn(),
  getSongsBeforeTimespan: jest.fn(),
  getRecentSongs: jest.fn(),
  getCategories: jest.fn(),
  getSongsByCategory: jest.fn(),
};

describe('SongBrowserService', () => {
  let service: SongBrowserService;
  let songService: SongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongBrowserService,
        {
          provide: SongService,
          useValue: mockSongService,
        },
      ],
    }).compile();

    service = module.get<SongBrowserService>(SongBrowserService);
    songService = module.get<SongService>(SongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFeaturedSongs', () => {
    it('should return featured songs', async () => {
      const songWithUser: SongWithUser = {
        title: 'Test Song',
        uploader: { username: 'testuser', profileImage: 'testimage' },
        stats: {
          duration: 100,
          noteCount: 100,
        },
      } as any;

      jest
        .spyOn(songService, 'getSongsForTimespan')
        .mockResolvedValue([songWithUser]);

      jest
        .spyOn(songService, 'getSongsBeforeTimespan')
        .mockResolvedValue([songWithUser]);

      await service.getFeaturedSongs();

      expect(songService.getSongsForTimespan).toHaveBeenCalled();
      expect(songService.getSongsBeforeTimespan).toHaveBeenCalled();
    });
  });

  describe('getRecentSongs', () => {
    it('should return recent songs', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };

      const songPreviewDto: SongPreviewDto = {
        title: 'Test Song',
        uploader: { username: 'testuser', profileImage: 'testimage' },
      } as any;

      jest
        .spyOn(songService, 'getRecentSongs')
        .mockResolvedValue([songPreviewDto]);

      const result = await service.getRecentSongs(query);

      expect(result).toEqual([songPreviewDto]);

      expect(songService.getRecentSongs).toHaveBeenCalledWith(
        query.page,
        query.limit,
      );
    });

    it('should throw an error if query parameters are invalid', async () => {
      const query: PageQueryDTO = { page: undefined, limit: undefined };

      await expect(service.getRecentSongs(query)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getCategories', () => {
    it('should return categories', async () => {
      const categories = { pop: 10, rock: 5 };

      jest.spyOn(songService, 'getCategories').mockResolvedValue(categories);

      const result = await service.getCategories();

      expect(result).toEqual(categories);
      expect(songService.getCategories).toHaveBeenCalled();
    });
  });

  describe('getSongsByCategory', () => {
    it('should return songs by category', async () => {
      const category = 'pop';
      const query: PageQueryDTO = { page: 1, limit: 10 };

      const songPreviewDto: SongPreviewDto = {
        title: 'Test Song',
        uploader: { username: 'testuser', profileImage: 'testimage' },
      } as any;

      jest
        .spyOn(songService, 'getSongsByCategory')
        .mockResolvedValue([songPreviewDto]);

      const result = await service.getSongsByCategory(category, query);

      expect(result).toEqual([songPreviewDto]);

      expect(songService.getSongsByCategory).toHaveBeenCalledWith(
        category,
        query.page,
        query.limit,
      );
    });
  });
});
