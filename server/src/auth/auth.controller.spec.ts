import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MagicLinkEmailStrategy } from './strategies/magicLinkEmail.strategy';

const mockAuthService = {
  githubLogin: jest.fn(),
  googleLogin: jest.fn(),
  discordLogin: jest.fn(),
  verifyToken: jest.fn(),
  loginWithEmail: jest.fn(),
};

const mockMagicLinkEmailStrategy = {
  send: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
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
      await controller.githubLogin();
      expect(authService.githubLogin).toHaveBeenCalled();
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
      await controller.googleLogin();
      expect(authService.googleLogin).toHaveBeenCalled();
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
      await controller.discordLogin();
      expect(authService.discordLogin).toHaveBeenCalled();
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
      const req = {} as Request;
      const res = {} as Response;

      await controller.magicLinkLogin(req, res);

      expect(mockMagicLinkEmailStrategy.send).toHaveBeenCalledWith(req, res);
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
});
