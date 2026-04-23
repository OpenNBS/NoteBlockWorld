import { Test, TestingModule } from '@nestjs/testing';

import { DEFAULT_SEED_FAKER } from '@nbw/config';
import type { UserDocument } from '@nbw/database';
import { SongService } from '@server/song/song.service';
import { UserService } from '@server/user/user.service';

import { SeedService } from './seed.service';

describe('SeedService', () => {
  let service: SeedService;
  let userService: {
    createWithEmail: jest.Mock;
    update: jest.Mock;
  };
  let songService: {
    uploadSong: jest.Mock;
    getSongById: jest.Mock;
  };

  beforeEach(async () => {
    userService = {
      createWithEmail: jest.fn().mockImplementation(async (email: string) => {
        return {
          email,
          socialLinks: {},
        } as unknown as UserDocument;
      }),
      update: jest.fn().mockImplementation(async (user: UserDocument) => user),
    };

    songService = {
      uploadSong: jest
        .fn()
        .mockResolvedValue({ publicId: 'seed-test-public-id' }),
      getSongById: jest.fn().mockResolvedValue({
        publicId: 'seed-test-public-id',
        save: jest.fn().mockResolvedValue(undefined),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: UserService, useValue: userService },
        { provide: SongService, useValue: songService },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seedDev', () => {
    it('creates users with deterministic emails and finishes without error', async () => {
      await expect(
        service.seedDev({ userCount: 2, fakerSeed: 99_999 }),
      ).resolves.toBeUndefined();

      expect(userService.createWithEmail).toHaveBeenCalledTimes(2);
      expect(userService.createWithEmail).toHaveBeenNthCalledWith(
        1,
        'nbw-seed-0000@seed.noteblockworld.test',
      );
      expect(userService.createWithEmail).toHaveBeenNthCalledWith(
        2,
        'nbw-seed-0001@seed.noteblockworld.test',
      );
      expect(userService.update).toHaveBeenCalledTimes(2);
    });

    it('uses default faker seed when omitted', async () => {
      await service.seedDev({ userCount: 1 });

      expect(userService.createWithEmail).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledTimes(1);
    });

    it('clamps userCount to configured bounds', async () => {
      await service.seedDev({ userCount: 0, fakerSeed: 1 });

      expect(userService.createWithEmail).toHaveBeenCalledTimes(1);
    });

    it('uploads songs via SongService when the random song count is non-zero', async () => {
      await service.seedDev({ userCount: 25, fakerSeed: DEFAULT_SEED_FAKER });

      expect(songService.uploadSong.mock.calls.length).toBeGreaterThan(0);
      expect(songService.getSongById.mock.calls.length).toBe(
        songService.uploadSong.mock.calls.length,
      );
    });
  });
});
