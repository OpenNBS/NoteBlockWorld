import { Test, TestingModule } from '@nestjs/testing';

import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: 'S3_BUCKET_SONGS',
          useValue: 'S3_BUCKET_SONGS',
        },
        {
          provide: 'S3_BUCKET_THUMBS',
          useValue: 'S3_BUCKET_THUMBS',
        },
        {
          provide: 'S3_BUCKET_SONGS',
          useValue: 'S3_BUCKET_SONGS',
        },
        {
          provide: 'S3_BUCKET_THUMBS',
          useValue: 'S3_BUCKET_THUMBS',
        },
        {
          provide: 'S3_KEY',
          useValue: 'S3_KEY',
        },
        {
          provide: 'S3_SECRET',
          useValue: 'S3_SECRET',
        },
        {
          provide: 'S3_ENDPOINT',
          useValue: 'S3_ENDPOINT',
        },
        {
          provide: 'S3_REGION',
          useValue: 'S3_REGION',
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
