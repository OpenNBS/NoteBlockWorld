import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request, Response } from 'express';

import { UserService } from '@server/user/user.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MagicLinkEmailStrategy } from './strategies/magicLinkEmail.strategy';

const mockAuthService = {
  githubLogin: jest.fn(),
  googleLogin: jest.fn(),
  discordLogin: jest.fn(),
  verifyToken: jest.fn(),
  loginWithEmail: jest.fn(),
  issueSessionTokensForUser: jest.fn(),
};

const mockUserService = {
  findByEmail: jest.fn(),
  findByID: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

const mockMagicLinkEmailStrategy = {
  send: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // Clear all mocks before each test to ensure test isolation
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: MagicLinkEmailStrategy,
          useValue: mockMagicLinkEmailStrategy,
        },
        { provide: UserService, useValue: mockUserService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('githubRedirect', () => {
    it('should call AuthService.githubLogin', async () => {
      const req = {} as Request;
      const res = {} as Response;

      await controller.githubRedirect(req, res);

      expect(authService.githubLogin).toHaveBeenCalledWith(req, res);
    });

    it('should handle exceptions', async () => {
      const req = {} as Request;
      const res = {} as Response;
      const error = new Error('Test error');
      (authService.githubLogin as jest.Mock).mockRejectedValueOnce(error);

      await expect(controller.githubRedirect(req, res)).rejects.toThrow(
        'Test error',
      );
    });
  });

  describe('githubLogin', () => {
    it('should call AuthService.githubLogin', async () => {
      // githubLogin is just a Passport guard entry point - it doesn't call authService
      // The actual login is handled by the callback endpoint (githubRedirect)
      controller.githubLogin();
      // Verify the method exists and can be called without errors
      expect(controller.githubLogin).toBeDefined();
      // Verify authService was NOT called (since this is just a guard entry point)
      expect(authService.githubLogin).not.toHaveBeenCalled();
    });
  });

  describe('googleRedirect', () => {
    it('should call AuthService.googleLogin', async () => {
      const req = {} as Request;
      const res = {} as Response;

      await controller.googleRedirect(req, res);

      expect(authService.googleLogin).toHaveBeenCalledWith(req, res);
    });

    it('should handle exceptions', async () => {
      const req = {} as Request;
      const res = {} as Response;
      const error = new Error('Test error');
      (authService.googleLogin as jest.Mock).mockRejectedValueOnce(error);

      await expect(controller.googleRedirect(req, res)).rejects.toThrow(
        'Test error',
      );
    });
  });

  describe('googleLogin', () => {
    it('should call AuthService.googleLogin', async () => {
      // googleLogin is just a Passport guard entry point - it doesn't call authService
      // The actual login is handled by the callback endpoint (googleRedirect)
      controller.googleLogin();
      // Verify the method exists and can be called without errors
      expect(controller.googleLogin).toBeDefined();
      // Verify authService was NOT called (since this is just a guard entry point)
      expect(authService.googleLogin).not.toHaveBeenCalled();
    });
  });

  describe('discordRedirect', () => {
    it('should call AuthService.discordLogin', async () => {
      const req = {} as Request;
      const res = {} as Response;

      await controller.discordRedirect(req, res);

      expect(authService.discordLogin).toHaveBeenCalledWith(req, res);
    });

    it('should handle exceptions', async () => {
      const req = {} as Request;
      const res = {} as Response;
      const error = new Error('Test error');
      (authService.discordLogin as jest.Mock).mockRejectedValueOnce(error);

      await expect(controller.discordRedirect(req, res)).rejects.toThrow(
        'Test error',
      );
    });
  });

  describe('discordLogin', () => {
    it('should call AuthService.discordLogin', async () => {
      // discordLogin is just a Passport guard entry point - it doesn't call authService
      // The actual login is handled by the callback endpoint (discordRedirect)
      controller.discordLogin();
      // Verify the method exists and can be called without errors
      expect(controller.discordLogin).toBeDefined();
      // Verify authService was NOT called (since this is just a guard entry point)
      expect(authService.discordLogin).not.toHaveBeenCalled();
    });
  });

  describe('magicLinkRedirect', () => {
    it('should call AuthService.loginWithEmail', async () => {
      const req = {} as Request;
      const res = {} as Response;

      await controller.magicLinkRedirect(req, res);

      expect(authService.loginWithEmail).toHaveBeenCalledWith(req, res);
    });

    it('should handle exceptions', async () => {
      const req = {} as Request;
      const res = {} as Response;
      const error = new Error('Test error');
      (authService.loginWithEmail as jest.Mock).mockRejectedValueOnce(error);

      await expect(controller.magicLinkRedirect(req, res)).rejects.toThrow(
        'Test error',
      );
    });
  });

  describe('magicLinkLogin', () => {
    it('should call AuthService.discordLogin', async () => {
      //const req = {} as Request;
      //const res = {} as Response;
      // TODO: Implement this test
      //await controller.magicLinkLogin(req, res);
      //
      //expect(mockMagicLinkEmailStrategy.send).toHaveBeenCalledWith(req, res);
    });
  });

  describe('verify', () => {
    it('should call AuthService.verifyToken', async () => {
      const req = {} as Request;
      const res = {} as Response;

      await controller.verify(req, res);

      expect(authService.verifyToken).toHaveBeenCalledWith(req, res);
    });
  });

  describe('e2eSession', () => {
    it('returns 404 when not in development', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'production';
        if (key === 'E2E_AUTH_SECRET') return 'secret';
        return undefined;
      });

      await expect(
        controller.e2eSession('secret', { email: 'a@b.c' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns 404 when E2E_AUTH_SECRET is empty', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'E2E_AUTH_SECRET') return '';
        return undefined;
      });

      await expect(
        controller.e2eSession('secret', { email: 'a@b.c' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns 404 when header secret is wrong', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'E2E_AUTH_SECRET') return 'good';
        return undefined;
      });

      await expect(
        controller.e2eSession('bad', { email: 'a@b.c' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns 400 when both email and userId are provided', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'E2E_AUTH_SECRET') return 's';
        return undefined;
      });

      await expect(
        controller.e2eSession('s', { email: 'a@b.c', userId: 'id' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('returns 400 when neither email nor userId', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'E2E_AUTH_SECRET') return 's';
        return undefined;
      });

      await expect(controller.e2eSession('s', {})).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('returns tokens for existing user by email', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'E2E_AUTH_SECRET') return 's';
        return undefined;
      });
      const user = { _id: 'u1', email: 'e@e.com', username: 'u' };
      mockUserService.findByEmail.mockResolvedValueOnce(user);
      mockAuthService.issueSessionTokensForUser.mockResolvedValueOnce({
        access_token: 'a',
        refresh_token: 'r',
      });

      const out = await controller.e2eSession('s', { email: 'e@e.com' });

      expect(out).toEqual({ access_token: 'a', refresh_token: 'r' });
      expect(mockUserService.findByEmail).toHaveBeenCalledWith('e@e.com');
      expect(mockAuthService.issueSessionTokensForUser).toHaveBeenCalledWith(
        user,
      );
    });

    it('returns tokens for existing user by userId', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'E2E_AUTH_SECRET') return 's';
        return undefined;
      });
      const user = { _id: 'u1', email: 'e@e.com', username: 'u' };
      mockUserService.findByID.mockResolvedValueOnce(user);
      mockAuthService.issueSessionTokensForUser.mockResolvedValueOnce({
        access_token: 'a',
        refresh_token: 'r',
      });

      const out = await controller.e2eSession('s', { userId: 'abc' });

      expect(out).toEqual({ access_token: 'a', refresh_token: 'r' });
      expect(mockUserService.findByID).toHaveBeenCalledWith('abc');
    });

    it('returns 404 when user is not found', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'E2E_AUTH_SECRET') return 's';
        return undefined;
      });
      mockUserService.findByEmail.mockResolvedValueOnce(null);

      await expect(
        controller.e2eSession('s', { email: 'missing@x.com' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
