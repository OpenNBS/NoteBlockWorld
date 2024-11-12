import { Test, TestingModule } from '@nestjs/testing';

import { FileService } from '@server/file/file.service';

import { SongController } from './song.controller';
import { SongService } from './song.service';

describe('SongController', () => {
  let controller: SongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongController],
      providers: [
        {
          provide: SongService,
          useValue: {},
        },
        {
          provide: FileService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SongController>(SongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
