import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { MailingService } from './mailing.service';

const MockedMailerService = {
  sendMail: jest.fn(),
};

describe('MailingService', () => {
  let service: MailingService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailingService,
        {
          provide: MailerService,
          useValue: MockedMailerService,
        },
      ],
    }).compile();

    service = module.get<MailingService>(MailingService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email using a template', async () => {
    const sendMailSpy = jest
      .spyOn(mailerService, 'sendMail')
      .mockResolvedValueOnce(undefined);

    const to = 'accountHolder@example.com';
    const subject = 'Test Email';
    const template = 'hello';

    const context = {
      name: 'John Doe',
      message: 'Hello, this is a test email!',
    };

    await service.sendEmail({ to, subject, template, context });

    expect(sendMailSpy).toHaveBeenCalledWith({
      to,
      subject,
      template,
      context,
    });
  });
});
