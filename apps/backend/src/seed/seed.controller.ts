import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';

@Controller('seed')
@ApiTags('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) {}

    @Get('seed-dev')
    @ApiOperation({
        summary: 'Seed the database with development data'
    })
    async seed() {
        this.seedService.seedDev();
        return {
            message: 'Seeding in progress'
        };
    }
}
