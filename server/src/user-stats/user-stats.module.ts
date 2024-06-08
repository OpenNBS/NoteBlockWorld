import { Module } from '@nestjs/common';

import { UserStatsService } from './user-stats.service';

@Module({
  providers: [UserStatsService],
  exports: [UserStatsService],
})
export class UserStatsModule {}
