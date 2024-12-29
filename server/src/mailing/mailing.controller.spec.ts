import { Test, TestingModule } from '@nestjs/testing';

import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';

describe('MailingController', () => {
  let controller: MailingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailingController],
      providers: [
        {
          provide: MailingService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MailingController>(MailingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
