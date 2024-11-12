import { Test, TestingModule } from '@nestjs/testing';

import { MySongsController } from './my-songs.controller';
import { SongService } from '../song.service';

describe('MySongsController', () => {
  let controller: MySongsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MySongsController],

      providers: [
        {
          provide: SongService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MySongsController>(MySongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
