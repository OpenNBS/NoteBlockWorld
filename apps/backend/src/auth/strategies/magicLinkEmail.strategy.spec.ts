import { describe, beforeEach, it, expect, jest } from 'bun:test';

import { UserDocument } from '@nbw/database';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { MailingService } from '@server/mailing/mailing.service';
import { UserService } from '@server/user/user.service';

import { MagicLinkEmailStrategy } from './magicLinkEmail.strategy';

describe('MagicLinkEmailStrategy', () => {
  let strategy: MagicLinkEmailStrategy;
  let userService: UserService;
  let mailingService: MailingService;
  let _configService: ConfigService;

  const mockUserService = {
    findByEmail    : jest.fn(),
    createWithEmail: jest.fn()
  };

  const mockMailingService = {
    sendEmail: jest.fn()
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'MAGIC_LINK_SECRET') return 'test_secret';
      if (key === 'SERVER_URL') return 'http://localhost:3000';
      return null;
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MagicLinkEmailStrategy,
        { provide: UserService, useValue: mockUserService },
        { provide: MailingService, useValue: mockMailingService },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide : 'MAGIC_LINK_SECRET',
          useValue: 'test_secret'
        },
        {
          provide : 'SERVER_URL',
          useValue: 'http://localhost:3000'
        }
      ]
    }).compile();

    strategy = module.get<MagicLinkEmailStrategy>(MagicLinkEmailStrategy);
    userService = module.get<UserService>(UserService);
    mailingService = module.get<MailingService>(MailingService);
    _configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('sendMagicLink', () => {
    it('should send a magic link email', async () => {
      const email = 'test@example.com';

      const magicLink =
        'http://localhost/api/v1/auth/magic-link/callback?token=test_token';

      const user = { username: 'testuser', email };

      mockUserService.findByEmail.mockResolvedValue(user);

      await MagicLinkEmailStrategy.sendMagicLink(
        'http://localhost:3000',
        userService,
        mailingService
      )(email, magicLink);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);

      expect(mockMailingService.sendEmail).toHaveBeenCalledWith({
        to     : email,
        context: {
          magicLink:
            'http://localhost/api/v1/auth/magic-link/callback?token=test_token',
          username: 'testuser'
        },
        subject : 'Noteblock Magic Link',
        template: 'magic-link'
      });
    });

    it('should create a new user if not found and send a magic link email', async () => {
      const email = 'testuser@test.com';

      const magicLink =
        'http://localhost/api/v1/auth/magic-link/callback?token=test_token';

      const user = { username: 'testuser', email };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.createWithEmail.mockResolvedValue(user);

      await MagicLinkEmailStrategy.sendMagicLink(
        'http://localhost:3000',
        userService,
        mailingService
      )(email, magicLink);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);

      expect(mockMailingService.sendEmail).toHaveBeenCalledWith({
        to     : email,
        context: {
          magicLink:
            'http://localhost/api/v1/auth/magic-link/callback?token=test_token',
          username: 'testuser'
        },
        subject : 'Welcome to Noteblock.world',
        template: 'magic-link-new-account'
      });
    });
  });

  describe('validate', () => {
    it('should validate the payload and return the user', async () => {
      const payload = { destination: 'test@example.com' };
      const user = { username: 'testuser', email: 'test@example.com' };

      mockUserService.findByEmail.mockResolvedValue(user);

      const result = await strategy.validate(payload);

      expect(result).toEqual(user as UserDocument);
    });

    it('should create a new user if not found and return the user', async () => {
      const payload = { destination: 'test@example.com' };

      mockUserService.findByEmail.mockResolvedValue(null);

      mockUserService.createWithEmail.mockResolvedValue({
        email   : 'test@example.com',
        username: 'test'
      });

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        email   : 'test@example.com',
        username: 'test'
      } as UserDocument);
    });
  });
});
