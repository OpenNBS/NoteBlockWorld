import { Test, TestingModule } from '@nestjs/testing';
import { EmailLoginController } from './email-login.controller';
import { EmailLoginService } from './email-login.service';

describe('EmailLoginController', () => {
  let controller: EmailLoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailLoginController],
      providers: [EmailLoginService],
    }).compile();

    controller = module.get<EmailLoginController>(EmailLoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
