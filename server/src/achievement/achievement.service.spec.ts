import { Test, TestingModule } from '@nestjs/testing';
import { AchievementService } from './achievement.service';

describe('AchievementService', () => {
  let service: AchievementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementService],
    }).compile();

    service = module.get<AchievementService>(AchievementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
