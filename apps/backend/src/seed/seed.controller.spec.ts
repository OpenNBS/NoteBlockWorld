import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import {
  DEFAULT_SEED_DATA_TIME_CAP,
  DEFAULT_SEED_FAKER,
  SEED_USER_COUNT_MAX,
} from './seed.types';

describe('SeedController', () => {
  let controller: SeedController;
  let seedService: { seedDev: jest.Mock };

  async function createController(nodeEnv: string) {
    seedService = { seedDev: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
      providers: [
        { provide: SeedService, useValue: seedService },
        { provide: 'NODE_ENV', useValue: nodeEnv },
      ],
    }).compile();

    return module.get<SeedController>(SeedController);
  }

  beforeEach(async () => {
    controller = await createController('development');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('seed', () => {
    it('calls seedDev with defaults when query params are omitted', async () => {
      const result = await controller.seed(undefined, undefined, undefined);

      expect(seedService.seedDev).toHaveBeenCalledTimes(1);
      expect(seedService.seedDev).toHaveBeenLastCalledWith({
        fakerSeed: DEFAULT_SEED_FAKER,
        userCount: 100,
      });
      expect(result).toMatchObject({
        message: 'Seeding complete',
        fakerSeed: DEFAULT_SEED_FAKER,
        userCount: 100,
        createdAtUpper: DEFAULT_SEED_DATA_TIME_CAP.toISOString(),
      });
    });

    it('parses fakerSeed and userCount from query strings', async () => {
      await controller.seed('7', '12', undefined);

      expect(seedService.seedDev).toHaveBeenLastCalledWith({
        fakerSeed: 7,
        userCount: 12,
      });
    });

    it('passes createdAtUpper when a valid ISO string is provided', async () => {
      const iso = '2024-03-01T15:30:00.000Z';
      await controller.seed(undefined, undefined, iso);

      expect(seedService.seedDev).toHaveBeenLastCalledWith({
        fakerSeed: DEFAULT_SEED_FAKER,
        userCount: 100,
        createdAtUpper: new Date(iso),
      });
    });

    it('clamps userCount to the configured maximum', async () => {
      await controller.seed(
        undefined,
        String(SEED_USER_COUNT_MAX + 999),
        undefined,
      );

      expect(seedService.seedDev).toHaveBeenLastCalledWith({
        fakerSeed: DEFAULT_SEED_FAKER,
        userCount: SEED_USER_COUNT_MAX,
      });
    });

    it('clamps userCount to at least 1', async () => {
      await controller.seed(undefined, '0', undefined);

      expect(seedService.seedDev).toHaveBeenLastCalledWith({
        fakerSeed: DEFAULT_SEED_FAKER,
        userCount: 1,
      });
    });

    it('throws BadRequest when fakerSeed is not an integer', async () => {
      await expect(
        controller.seed('not-int', undefined, undefined),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.seed('not-int', undefined, undefined),
      ).rejects.toThrow('fakerSeed must be an integer');
      expect(seedService.seedDev).not.toHaveBeenCalled();
    });

    it('throws BadRequest when userCount is not an integer', async () => {
      await expect(controller.seed(undefined, 'x', undefined)).rejects.toThrow(
        BadRequestException,
      );
      expect(seedService.seedDev).not.toHaveBeenCalled();
    });

    it('throws BadRequest when createdAtUpper is not a valid date', async () => {
      await expect(
        controller.seed(undefined, undefined, 'not-a-date'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.seed(undefined, undefined, 'not-a-date'),
      ).rejects.toThrow('createdAtUpper must be a valid ISO 8601 date string');
      expect(seedService.seedDev).not.toHaveBeenCalled();
    });

    it('throws BadRequest when NODE_ENV is not development', async () => {
      const prodController = await createController('production');

      await expect(
        prodController.seed(undefined, undefined, undefined),
      ).rejects.toThrow(BadRequestException);
      await expect(
        prodController.seed(undefined, undefined, undefined),
      ).rejects.toThrow('Seeding is only allowed in development mode');
      expect(seedService.seedDev).not.toHaveBeenCalled();
    });
  });
});
