import { Test, TestingModule } from '@nestjs/testing';

import { SongBrowserController } from './song-browser.controller';

describe('SongBrowserController', () => {
  let controller: SongBrowserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongBrowserController],
    }).compile();

    controller = module.get<SongBrowserController>(SongBrowserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
