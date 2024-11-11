import { SongUploadService } from './song-upload.service';

describe('SongUploadService', () => {
  let service: SongUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongUploadService],
    }).compile();

    service = module.get<SongUploadService>(SongUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
