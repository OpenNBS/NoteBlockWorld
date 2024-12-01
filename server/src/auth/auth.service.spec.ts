import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import type { Request, Response } from 'express';

import { UserService } from '@server/user/user.service';

import { AuthService } from './auth.service';
import { DiscordUser } from './types/discordProfile';
import { GithubAccessToken } from './types/githubProfile';
import { GoogleProfile } from './types/googleProfile';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

const mockUserService = {
  generateUsername: jest.fn(),
  findByEmail: jest.fn(),
  findByID: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  decode: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: 'FRONTEND_URL',
          useValue: 'http://frontend.test.com',
        },
        {
          provide: 'COOKIE_EXPIRES_IN',
          useValue: '1d',
        },
        {
          provide: 'JWT_SECRET',
          useValue: 'test-jwt-secret',
        },
        {
          provide: 'JWT_EXPIRES_IN',
          useValue: '1d',
        },
        {
          provide: 'JWT_REFRESH_SECRET',
          useValue: 'test-jwt-refresh-secret',
        },
        {
          provide: 'JWT_REFRESH_EXPIRES_IN',
          useValue: '7d',
        },
        {
          provide: 'WHITELISTED_USERS',
          useValue: 'tomast1337,bentroen,testuser',
        },
        {
          provide: 'APP_DOMAIN',
          useValue: '.test.com',
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('verifyToken', () => {
    it('should throw an error if no authorization header is provided', async () => {
      const req = { headers: {} } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await authService.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: 'No authorization header',
      });
    });

    it('should throw an error if no token is provided', async () => {
      const req = { headers: { authorization: 'Bearer ' } } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await authService.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    });

    it('should throw an error if user is not found', async () => {
      const req = {
        headers: { authorization: 'Bearer test-token' },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      mockJwtService.verify.mockReturnValueOnce({ id: 'test-id' });
      mockUserService.findByID.mockResolvedValueOnce(null);

      await authService.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return decoded token if user is found', async () => {
      const req = {
        headers: { authorization: 'Bearer test-token' },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const decodedToken = { id: 'test-id' };
      mockJwtService.verify.mockReturnValueOnce(decodedToken);
      mockUserService.findByID.mockResolvedValueOnce({ id: 'test-id' });

      const result = await authService.verifyToken(req, res);
      expect(result).toEqual(decodedToken);
    });
  });

  describe('googleLogin', () => {
    it('should generate token and redirect if user is whitelisted', async () => {
      const req: Partial<Request> = {
        user: {
          emails: [{ value: 'test@example.com' }],
          photos: [{ value: 'http://example.com/photo.jpg' }],
        } as GoogleProfile,
      };

      const res: Partial<Response> = {
        redirect: jest.fn(),
      };

      jest.spyOn(authService as any, 'verifyWhitelist').mockResolvedValue(true);

      jest
        .spyOn(authService as any, 'verifyAndGetUser')
        .mockResolvedValue({ id: 'user-id' });

      jest
        .spyOn(authService as any, 'GenTokenRedirect')
        .mockImplementation((user, res: any) => {
          res.redirect('/dashboard');
        });

      await authService.googleLogin(
        req as unknown as Request,
        res as unknown as Response,
      );

      expect((authService as any).verifyAndGetUser).toHaveBeenCalledWith({
        username: 'test',
        email: 'test@example.com',
        profileImage: 'http://example.com/photo.jpg',
      });

      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect to login if user is not whitelisted', async () => {
      const req = {
        user: {
          emails: [{ value: 'test@example.com' }],
          photos: [{ value: 'http://example.com/photo.jpg' }],
        } as GoogleProfile,
      };

      const res = {
        redirect: jest.fn(),
      };

      jest
        .spyOn(authService as any, 'verifyWhitelist')
        .mockResolvedValue(false);

      await authService.googleLogin(
        req as unknown as Request,
        res as unknown as Response,
      );

      expect(res.redirect).toHaveBeenCalledWith(
        (authService as any).FRONTEND_URL + '/login',
      );
    });
  }); // TODO: implement tests for googleLogin

  describe('githubLogin', () => {
    it('should generate token and redirect if user is whitelisted', async () => {
      const req: Partial<Request> = {
        user: {
          accessToken: 'test-access-token',
          profile: {
            username: 'testuser',
            photos: [{ value: 'http://example.com/photo.jpg' }],
          },
        } as GithubAccessToken,
      };

      const res: Partial<Response> = {
        redirect: jest.fn(),
      };

      jest.spyOn(authService as any, 'verifyWhitelist').mockResolvedValue(true);

      jest
        .spyOn(authService as any, 'verifyAndGetUser')
        .mockResolvedValue({ id: 'user-id' });

      jest
        .spyOn(authService as any, 'GenTokenRedirect')
        .mockImplementation((user, res: any) => {
          res.redirect('/dashboard');
        });

      mockAxios.get.mockResolvedValue({
        data: [{ email: 'test@example.com', primary: true }],
      } as any);

      await authService.githubLogin(req as Request, res as Response);

      expect((authService as any).verifyWhitelist).toHaveBeenCalledWith(
        'testuser',
      );

      expect((authService as any).verifyAndGetUser).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'http://example.com/photo.jpg',
      });

      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect to login if user is not whitelisted', async () => {
      const req: Partial<Request> = {
        user: {
          accessToken: 'test-access-token',
          profile: {
            username: 'testuser',
            photos: [{ value: 'http://example.com/photo.jpg' }],
          },
        } as GithubAccessToken,
      };

      const res: Partial<Response> = {
        redirect: jest.fn(),
      };

      jest
        .spyOn(authService as any, 'verifyWhitelist')
        .mockResolvedValue(false);

      mockAxios.get.mockResolvedValue({
        data: [{ email: 'test@example.com', primary: true }],
      } as any);

      await authService.githubLogin(req as Request, res as Response);

      expect(res.redirect).toHaveBeenCalledWith(
        (authService as any).FRONTEND_URL + '/login',
      );
    });
  });

  describe('discordLogin', () => {
    it('should generate token and redirect if user is whitelisted', async () => {
      const req: Partial<Request> = {
        user: {
          profile: {
            id: 'discord-user-id',
            username: 'testuser',
            email: 'test@example.com',
            avatar: 'avatar-hash',
          },
        } as DiscordUser,
      };

      const res: Partial<Response> = {
        redirect: jest.fn(),
      };

      jest.spyOn(authService as any, 'verifyWhitelist').mockResolvedValue(true);

      jest
        .spyOn(authService as any, 'verifyAndGetUser')
        .mockResolvedValue({ id: 'user-id' });

      jest
        .spyOn(authService as any, 'GenTokenRedirect')
        .mockImplementation((user, res: any) => {
          res.redirect('/dashboard');
        });

      await authService.discordLogin(req as Request, res as Response);

      expect((authService as any).verifyWhitelist).toHaveBeenCalledWith(
        'testuser',
      );

      expect((authService as any).verifyAndGetUser).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        profileImage:
          'https://cdn.discordapp.com/avatars/discord-user-id/avatar-hash.png',
      });

      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect to login if user is not whitelisted', async () => {
      const req: Partial<Request> = {
        user: {
          profile: {
            id: 'discord-user-id',
            username: 'testuser',
            email: 'test@example.com',
            avatar: 'avatar-hash',
          },
        } as DiscordUser,
      };

      const res: Partial<Response> = {
        redirect: jest.fn(),
      };

      jest
        .spyOn(authService as any, 'verifyWhitelist')
        .mockResolvedValue(false);

      await authService.discordLogin(req as Request, res as Response);

      expect(res.redirect).toHaveBeenCalledWith(
        (authService as any).FRONTEND_URL + '/login',
      );
    });
  }); // TODO: implement tests for discordLogin

  describe('getUserFromToken', () => {
    it('should return null if token is invalid', async () => {
      mockJwtService.decode.mockReturnValueOnce(null);

      const result = await authService.getUserFromToken('invalid-token');
      expect(result).toBeNull();
    });

    it('should return user if token is valid', async () => {
      const decodedToken = { id: 'test-id' };
      mockJwtService.decode.mockReturnValueOnce(decodedToken);
      mockUserService.findByID.mockResolvedValueOnce({ id: 'test-id' });

      const result = await authService.getUserFromToken('valid-token');
      expect(result).toEqual({ id: 'test-id' });
    });
  });
});
