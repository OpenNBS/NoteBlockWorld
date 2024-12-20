import { DynamicModule, Module } from '@nestjs/common';

import { CryptoService } from './crypto.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

export class CryptoModule {
  static forRoot(): DynamicModule {
    return {
      module: CryptoModule,
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: 'SALTS_ROUNDS',
          useValue: (configService: ConfigService) =>
            configService.getOrThrow<string>('SALTS_ROUNDS'),
        },
        CryptoService,
      ],
      exports: [CryptoService],
    };
  }
}
