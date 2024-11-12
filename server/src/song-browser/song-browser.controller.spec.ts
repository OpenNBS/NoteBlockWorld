import { Test, TestingModule } from '@nestjs/testing';

import { SongBrowserController } from './song-browser.controller';
import { SongBrowserService } from './song-browser.service';

describe('SongBrowserController', () => {
  let controller: SongBrowserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongBrowserController],
      providers: [
        {
          provide: SongBrowserService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SongBrowserController>(SongBrowserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
