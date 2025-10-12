import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypesenseService } from './typesense.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'TYPESENSE_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const Typesense = (await import('typesense')).default;
        return new Typesense.Client({
          nodes: [
            {
              host: configService.get<string>('TYPESENSE_HOST'),
              port: Number(configService.get<string>('TYPESENSE_PORT')),
              protocol: configService.get<string>('TYPESENSE_PROTOCOL'),
            },
          ],
          apiKey: configService.get<string>('TYPESENSE_API_KEY'),
          connectionTimeoutSeconds: 2,
        });
      },
      inject: [ConfigService],
    },
    TypesenseService,
  ],
  exports: [TypesenseService],
})
export class TypesenseModule {}
