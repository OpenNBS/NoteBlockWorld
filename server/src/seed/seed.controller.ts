import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('seed')
@ApiTags('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('seed-dev')
  @ApiOperation({
    summary: 'Seed the database with development data',
  })
  async seed() {
    return await this.seedService.seedDev();
  }
}
