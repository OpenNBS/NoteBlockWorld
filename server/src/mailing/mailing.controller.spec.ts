import { Test, TestingModule } from '@nestjs/testing';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';

describe('MailingController', () => {
  let controller: MailingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailingController],
      providers: [MailingService],
    }).compile();

    controller = module.get<MailingController>(MailingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
