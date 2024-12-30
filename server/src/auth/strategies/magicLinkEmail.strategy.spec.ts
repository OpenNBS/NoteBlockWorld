import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailingService } from '@server/mailing/mailing.service';
import { UserService } from '@server/user/user.service';
import { MagicLinkEmailStrategy } from './magicLinkEmail.strategy';

describe('MagicLinkEmailStrategy', () => {
  let strategy: MagicLinkEmailStrategy;
  let userService: UserService;
  let mailingService: MailingService;
  let configService: ConfigService;

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockMailingService = {
    sendEmail: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'MAGIC_LINK_SECRET') return 'test_secret';
      if (key === 'SERVER_URL') return 'http://localhost:3000';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MagicLinkEmailStrategy,
        { provide: UserService, useValue: mockUserService },
        { provide: MailingService, useValue: mockMailingService },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: 'MAGIC_LINK_SECRET',
          useValue: 'test_secret',
        },
        {
          provide: 'SERVER_URL',
          useValue: 'http://localhost:3000',
        },
      ],
    }).compile();

    strategy = module.get<MagicLinkEmailStrategy>(MagicLinkEmailStrategy);
    userService = module.get<UserService>(UserService);
    mailingService = module.get<MailingService>(MailingService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('sendMagicLink', () => {
    it('should send a magic link email', async () => {
      const email = 'test@example.com';
      const magicLink = '/api/v1/auth/magic-link/callback?token=test_token';
      const user = { username: 'testuser', email };

      mockUserService.findByEmail.mockResolvedValue(user);

      await MagicLinkEmailStrategy.sendMagicLink(
        'http://localhost:3000',
        userService,
        mailingService,
      )(email, magicLink);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      // TODO: Fix this test
      expect(mockMailingService.sendEmail).toHaveBeenCalledWith({
        to: email,
        context: {
          magicLink:
            'http://localhost:3000/api/v1/auth/magic-link/callback?token=test_token',
          username: 'testuser',
        },
        subject: 'Noteblock Magic Link',
        template: 'magic-link',
      });
    });

    it('should log an error if user is not found', async () => {
      const email = 'test@example.com';
      const magicLink = '/api/v1/auth/magic-link/callback?token=test_token';

      mockUserService.findByEmail.mockResolvedValue(null);

      const loggerSpy = jest.spyOn(MagicLinkEmailStrategy.logger, 'error');

      await MagicLinkEmailStrategy.sendMagicLink(
        'http://localhost:3000',
        userService,
        mailingService,
      )(email, magicLink);

      expect(loggerSpy).toHaveBeenCalledWith('User not found');
    });
  });

  describe('validate', () => {
    it('should validate the payload and return the user', async () => {
      const payload = { destination: 'test@example.com' };
      const user = { username: 'testuser', email: 'test@example.com' };

      mockUserService.findByEmail.mockResolvedValue(user);

      const result = await strategy.validate(payload);

      expect(result).toEqual(user);
    });

    it('should log an error if user is not found', async () => {
      const payload = { destination: 'test@example.com' };

      mockUserService.findByEmail.mockResolvedValue(null);

      const loggerSpy = jest.spyOn(MagicLinkEmailStrategy.logger, 'error');

      const result = await strategy.validate(payload);

      expect(loggerSpy).toHaveBeenCalledWith(
        'User not found: test@example.com',
      );
      expect(result).toBeNull();
    });
  });
});
