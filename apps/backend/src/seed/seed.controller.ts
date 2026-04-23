import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';
import {
  DEFAULT_SEED_DATA_TIME_CAP,
  DEFAULT_SEED_FAKER,
  SEED_USER_COUNT_MAX,
  SEED_USER_COUNT_MIN,
  type SeedDevOptions,
} from './seed.types';

@Controller('seed')
@ApiTags('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService,
    @Inject('NODE_ENV')
    private readonly NODE_ENV: string,
  ) {}

  @Get('seed-dev')
  @ApiOperation({
    summary:
      'Seed the database with development data (deterministic by default)',
    description:
      'Uses a fixed Faker seed and stable user emails unless overridden. ' +
      'Use a fresh database or expect "email already registered" on repeat. ' +
      'Song `publicId` values still use random nanoids from the upload pipeline.',
  })
  @ApiQuery({
    name: 'fakerSeed',
    required: false,
    type: Number,
    example: DEFAULT_SEED_FAKER,
  })
  @ApiQuery({
    name: 'userCount',
    required: false,
    type: Number,
    example: 20,
    description: `Clamped to ${SEED_USER_COUNT_MIN}–${SEED_USER_COUNT_MAX}.`,
  })
  @ApiQuery({
    name: 'createdAtUpper',
    required: false,
    type: String,
    example: DEFAULT_SEED_DATA_TIME_CAP.toISOString(),
    description: 'ISO 8601 upper bound for random user/song createdAt.',
  })
  async seed(
    @Query('fakerSeed') fakerSeedRaw?: string,
    @Query('userCount') userCountRaw?: string,
    @Query('createdAtUpper') createdAtUpperIso?: string,
  ) {
    if (this.NODE_ENV !== 'development') {
      throw new BadRequestException(
        'Seeding is only allowed in development mode',
      );
    }
    const fakerSeed = parseOptionalIntQuery(
      fakerSeedRaw,
      DEFAULT_SEED_FAKER,
      'fakerSeed',
    );
    const userCount = parseOptionalIntQuery(
      userCountRaw,
      100,
      'userCount',
      SEED_USER_COUNT_MIN,
      SEED_USER_COUNT_MAX,
    );

    const options: SeedDevOptions = { fakerSeed, userCount };

    if (createdAtUpperIso !== undefined && createdAtUpperIso !== '') {
      const d = new Date(createdAtUpperIso);
      if (Number.isNaN(d.getTime())) {
        throw new BadRequestException(
          'createdAtUpper must be a valid ISO 8601 date string',
        );
      }
      options.createdAtUpper = d;
    }

    await this.seedService.seedDev(options);

    return {
      message: 'Seeding complete',
      fakerSeed: options.fakerSeed,
      userCount: options.userCount,
      createdAtUpper: (
        options.createdAtUpper ?? DEFAULT_SEED_DATA_TIME_CAP
      ).toISOString(),
    };
  }
}

function parseOptionalIntQuery(
  raw: string | undefined,
  fallback: number,
  name: string,
  min?: number,
  max?: number,
): number {
  if (raw === undefined || raw === '') {
    return fallback;
  }

  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) {
    throw new BadRequestException(`${name} must be an integer`);
  }

  let v = Math.trunc(n);
  if (min !== undefined) {
    v = Math.max(min, v);
  }
  if (max !== undefined) {
    v = Math.min(max, v);
  }

  return v;
}
