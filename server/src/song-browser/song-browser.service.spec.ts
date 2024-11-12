import { Test, TestingModule } from '@nestjs/testing';

import { SongService } from '@server/song/song.service';

import { SongBrowserService } from './song-browser.service';

describe('SongBrowserService', () => {
  let service: SongBrowserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongBrowserService,
        {
          provide: SongService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SongBrowserService>(SongBrowserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
