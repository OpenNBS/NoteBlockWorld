import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptoService } from './crypto.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    ConfigService,
    {
      provide: 'SALTS_ROUNDS',
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow<number>('SALTS_ROUNDS'),
      inject: [ConfigService],
    },
    CryptoService,
  ],
  exports: [CryptoService],
})
export class CryptoModule {
  /*
  static forRoot(): DynamicModule {
    return {
      module: CryptoModule,
      imports: [ConfigModule.forRoot()],
      providers: [
        ConfigService,
        {
          provide: 'SALTS_ROUNDS',
          useValue: (configService: ConfigService) =>
            configService.getOrThrow<number>('SALTS_ROUNDS'),
        },
        CryptoService,
      ],
      exports: [CryptoService],
    };
  }
 */
}
