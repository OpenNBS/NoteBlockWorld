import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptoService } from './crypto.service';

@Module({
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
})
export class CryptoModule {}
