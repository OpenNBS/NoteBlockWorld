import { Test, TestingModule } from '@nestjs/testing';

import { FileService } from '@server/file/file.service';
import { UserService } from '@server/user/user.service';

import { SongUploadService } from './song-upload.service';

describe('SongUploadService', () => {
  let service: SongUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongUploadService,
        { provide: FileService, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    }).compile();

    service = module.get<SongUploadService>(SongUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
