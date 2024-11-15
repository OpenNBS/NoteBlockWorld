import { Test, TestingModule } from '@nestjs/testing';

import { FileService } from '@server/file/file.service';
import { UserService } from '@server/user/user.service';

import { SongUploadService } from './song-upload.service';

jest.mock('@shared/features/thumbnail', () => ({
  drawToImage: jest.fn(),
}));

jest.mock('@shared/features/song/pack', () => ({
  obfuscateAndPackSong: jest.fn(),
}));

const mockFileService = {
  uploadSong: jest.fn(),
  uploadPackedSong: jest.fn(),
  uploadThumbnail: jest.fn(),
  getSongFile: jest.fn(),
};

const mockUserService = {
  findByID: jest.fn(),
};

describe('SongUploadService', () => {
  let service: SongUploadService;
  let _fileService: FileService;
  let _userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongUploadService,
        {
          provide: FileService,
          useValue: mockFileService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<SongUploadService>(SongUploadService);
    _fileService = module.get<FileService>(FileService);
    _userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: Add tests
});
