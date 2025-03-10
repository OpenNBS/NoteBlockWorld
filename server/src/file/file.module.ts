import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FileService } from './file.service';

@Module({})
export class FileModule {
  static forRootAsync(): DynamicModule {
    return {
      module: FileModule,
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: 'S3_BUCKET_SONGS',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_BUCKET_SONGS'),
        },
        {
          provide: 'S3_BUCKET_THUMBS',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_BUCKET_THUMBS'),
        },
        {
          provide: 'S3_KEY',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_KEY'),
        },
        {
          provide: 'S3_SECRET',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_SECRET'),
        },
        {
          provide: 'S3_ENDPOINT',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_ENDPOINT'),
        },
        {
          provide: 'S3_REGION',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_REGION'),
        },
        FileService,
      ],
      exports: [FileService],
    };
  }
}
