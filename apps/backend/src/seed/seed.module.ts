import { env } from 'node:process';

import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SongModule } from '@server/song/song.module';
import { UserModule } from '@server/user/user.module';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({})
export class SeedModule {
    private static readonly logger = new Logger(SeedModule.name);
    static forRoot(): DynamicModule {
        if (env.NODE_ENV !== 'development') {
            SeedModule.logger.warn('Seeding is only allowed in development mode');
            return {
                module: SeedModule
            };
        } else {
            SeedModule.logger.warn('Seeding is allowed in development mode');
            return {
                module   : SeedModule,
                imports  : [UserModule, SongModule, ConfigModule.forRoot()],
                providers: [
                    ConfigService,
                    SeedService,
                    {
                        provide   : 'NODE_ENV',
                        useFactory: (configService: ConfigService) =>
                            configService.get('NODE_ENV'),
                        inject: [ConfigService]
                    }
                ],
                controllers: [SeedController]
            };
        }
    }
}
