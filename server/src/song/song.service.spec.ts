import { Test, TestingModule } from '@nestjs/testing';

import { FileService } from '@server/file/file.service';

import { SongUploadService } from './song-upload/song-upload.service';
import { SongService } from './song.service';

describe('SongService', () => {
  let service: SongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongService,
        {
          provide: 'SongModel',
          useValue: {},
        },
        {
          provide: FileService,
          useValue: {},
        },
        {
          provide: SongUploadService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SongService>(SongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
