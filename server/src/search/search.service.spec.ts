import { Test, TestingModule } from '@nestjs/testing';

import { SongService } from '@server/song/song.service';
import { UserService } from '@server/user/user.service';

import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: UserService,
          useValue: {
            search: jest.fn(),
          },
        },
        {
          provide: SongService,
          useValue: {
            search: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
