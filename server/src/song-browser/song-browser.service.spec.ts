import { Test, TestingModule } from '@nestjs/testing';

import { SongBrowserService } from './song-browser.service';

describe('SongBrowserService', () => {
  let service: SongBrowserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongBrowserService],
    }).compile();

    service = module.get<SongBrowserService>(SongBrowserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
