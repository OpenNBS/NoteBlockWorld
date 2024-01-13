import { Test, TestingModule } from '@nestjs/testing';
import { AchievementController } from './achievement.controller';

describe('AchievementController', () => {
  let controller: AchievementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementController],
    }).compile();

    controller = module.get<AchievementController>(AchievementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
