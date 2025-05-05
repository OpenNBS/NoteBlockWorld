import { HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import type { UserDocument } from '@server/user/entity/user.entity';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { SongPageDto } from '@shared/validation/song/dto/SongPageDto';

import { SongService } from '../song.service';
import { MySongsController } from './my-songs.controller';

const mockSongService = {
  getMySongsPage: jest.fn(),
};

describe('MySongsController', () => {
  let controller: MySongsController;
  let songService: SongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MySongsController],
      providers: [
        {
          provide: SongService,
          useValue: mockSongService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt-refresh'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<MySongsController>(MySongsController);
    songService = module.get<SongService>(SongService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMySongsPage', () => {
    it('should return a list of songs uploaded by the current authenticated user', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songPageDto: SongPageDto = {
        content: [],
        page: 0,
        limit: 0,
        total: 0,
      };

      mockSongService.getMySongsPage.mockResolvedValueOnce(songPageDto);

      const result = await controller.getMySongsPage(query, user);

      expect(result).toEqual(songPageDto);
      expect(songService.getMySongsPage).toHaveBeenCalledWith({ query, user });
    });

    it('should handle thrown an exception if userDocument is null', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const user = null;
      await expect(controller.getMySongsPage(query, user)).rejects.toThrow(
        HttpException,
      );
    });

    it('should handle exceptions', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const error = new Error('Test error');

      mockSongService.getMySongsPage.mockRejectedValueOnce(error);

      await expect(controller.getMySongsPage(query, user)).rejects.toThrow(
        'Test error',
      );
    });
  });
});
