import { DynamicModule, Logger, Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UserModule } from '@server/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { env } from 'node:process';

@Module({})
export class SeedModule {
  private static readonly logger = new Logger(SeedModule.name);
  static forRoot(): DynamicModule {
    if (env.NODE_ENV !== 'development') {
      SeedModule.logger.warn('Seeding is only allowed in development mode');
      return {
        module: SeedModule,
      };
    } else {
      SeedModule.logger.warn('Seeding is allowed in development mode');
      return {
        module: SeedModule,
        imports: [UserModule, ConfigModule.forRoot()],
        providers: [
          ConfigService,
          SeedService,
          {
            provide: 'NODE_ENV',
            useFactory: (configService: ConfigService) =>
              configService.get('NODE_ENV'),
            inject: [ConfigService],
          },
        ],
        controllers: [SeedController],
      };
    }
  }
}
