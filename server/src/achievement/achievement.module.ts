import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';

@Module({
  providers: [AchievementService],
  controllers: [AchievementController]
})
export class AchievementModule {}
