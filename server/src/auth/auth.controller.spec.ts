import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  githubLogin: jest.fn(),
  googleLogin: jest.fn(),
  discordLogin: jest.fn(),
  verifyToken: jest.fn(),
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

  describe('verify', () => {
    it('should call AuthService.verifyToken', async () => {
      const req = {} as Request;
      const res = {} as Response;

      await controller.verify(req, res);

      expect(authService.verifyToken).toHaveBeenCalledWith(req, res);
    });
  });
});
