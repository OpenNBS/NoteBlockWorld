import { jest, describe, beforeEach, expect, it } from 'bun:test';

import { Test, TestingModule } from '@nestjs/testing';

import { SongService } from '@server/song/song.service';
import { UserService } from '@server/user/user.service';

import { SeedService } from './seed.service';

describe('SeedService', () => {
  let service: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide : 'NODE_ENV',
          useValue: 'development'
        },
        {
          provide : UserService,
          useValue: {
            createWithPassword: jest.fn()
          }
        },
        {
          provide : SongService,
          useValue: {
            uploadSong : jest.fn(),
            getSongById: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
