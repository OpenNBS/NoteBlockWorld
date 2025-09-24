import { jest, describe, beforeEach, expect, it } from 'bun:test';

import { FeaturedSongsDto, PageQueryDTO, SongPreviewDto } from '@nbw/database';
import { Test, TestingModule } from '@nestjs/testing';

import { SongBrowserController } from './song-browser.controller';
import { SongBrowserService } from './song-browser.service';

const mockSongBrowserService = {
    getFeaturedSongs  : jest.fn(),
    getRecentSongs    : jest.fn(),
    getCategories     : jest.fn(),
    getSongsByCategory: jest.fn()
};

describe('SongBrowserController', () => {
    let controller: SongBrowserController;
    let songBrowserService: SongBrowserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SongBrowserController],
            providers  : [
                {
                    provide : SongBrowserService,
                    useValue: mockSongBrowserService
                }
            ]
        }).compile();

        controller = module.get<SongBrowserController>(SongBrowserController);
        songBrowserService = module.get<SongBrowserService>(SongBrowserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getFeaturedSongs', () => {
        it('should return a list of featured songs', async () => {
            const featuredSongs: FeaturedSongsDto = {} as FeaturedSongsDto;

            mockSongBrowserService.getFeaturedSongs.mockResolvedValueOnce(
                featuredSongs
            );

            const result = await controller.getFeaturedSongs();

            expect(result).toEqual(featuredSongs);
            expect(songBrowserService.getFeaturedSongs).toHaveBeenCalled();
        });
    });

    describe('getSongList', () => {
        it('should return a list of recent songs', async () => {
            const query: PageQueryDTO = { page: 1, limit: 10 };
            const songList: SongPreviewDto[] = [];

            mockSongBrowserService.getRecentSongs.mockResolvedValueOnce(songList);

            const result = await controller.getSongList(query);

            expect(result).toEqual(songList);
            expect(songBrowserService.getRecentSongs).toHaveBeenCalledWith(query);
        });
    });

    describe('getCategories', () => {
        it('should return a list of song categories and song counts', async () => {
            const categories: Record<string, number> = {
                category1: 10,
                category2: 5
            };

            mockSongBrowserService.getCategories.mockResolvedValueOnce(categories);

            const result = await controller.getCategories();

            expect(result).toEqual(categories);
            expect(songBrowserService.getCategories).toHaveBeenCalled();
        });
    });

    describe('getSongsByCategory', () => {
        it('should return a list of songs by category', async () => {
            const id = 'test-category';
            const query: PageQueryDTO = { page: 1, limit: 10 };
            const songList: SongPreviewDto[] = [];

            mockSongBrowserService.getSongsByCategory.mockResolvedValueOnce(songList);

            const result = await controller.getSongsByCategory(id, query);

            expect(result).toEqual(songList);

            expect(songBrowserService.getSongsByCategory).toHaveBeenCalledWith(
                id,
                query
            );
        });
    });
});
