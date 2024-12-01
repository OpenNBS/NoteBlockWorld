import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import type { Request, Response } from 'express';

import { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';

import { AuthService } from './auth.service';
import { DiscordUser } from './types/discordProfile';
import { GithubAccessToken } from './types/githubProfile';
import { GoogleProfile } from './types/googleProfile';
import { Profile } from './types/profile';

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

  describe('createJwtPayload', () => {
    it('should create access and refresh tokens', async () => {
      const payload = { id: 'user-id', username: 'testuser' };
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation((payload, options: any) => {
          if (options.secret === 'test-jwt-secret') {
            return Promise.resolve(accessToken);
          } else if (options.secret === 'test-jwt-refresh-secret') {
            return Promise.resolve(refreshToken);
          }

          return Promise.reject(new Error('Invalid secret'));
        });

      const tokens = await (authService as any).createJwtPayload(payload);

      expect(tokens).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: 'test-jwt-secret',
        expiresIn: '1d',
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: 'test-jwt-refresh-secret',
        expiresIn: '7d',
      });
    });
  });

  describe('GenTokenRedirect', () => {
    it('should set cookies and redirect to the frontend URL', async () => {
      const user_registered = {
        _id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
      } as unknown as UserDocument;

      const res = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;

      const tokens = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };

      jest
        .spyOn(authService as any, 'createJwtPayload')
        .mockResolvedValue(tokens);

      await (authService as any).GenTokenRedirect(user_registered, res);

      expect((authService as any).createJwtPayload).toHaveBeenCalledWith({
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
      });

      expect(res.cookie).toHaveBeenCalledWith('token', 'access-token', {
        domain: '.test.com',
        maxAge: 1,
      });

      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-token',
        {
          domain: '.test.com',
          maxAge: 1,
        },
      );

      expect(res.redirect).toHaveBeenCalledWith('http://frontend.test.com/');
    });
  });

  describe('verifyWhitelist', () => {
    it('should approve login if whitelist is empty', async () => {
      (authService as any).WHITELISTED_USERS = '';
      const result = await (authService as any).verifyWhitelist('anyuser');
      expect(result).toBe(true);
    });

    it('should approve login if username is in the whitelist', async () => {
      (authService as any).WHITELISTED_USERS = 'user1,user2,user3';
      const result = await (authService as any).verifyWhitelist('user1');
      expect(result).toBe(true);
    });

    it('should reject login if username is not in the whitelist', async () => {
      const result = await (authService as any).verifyWhitelist('user4');
      expect(result).toBe(false);
    });

    it('should approve login if username is in the whitelist (case insensitive)', async () => {
      (authService as any).WHITELISTED_USERS = 'user1,user2,user3';
      const result = await (authService as any).verifyWhitelist('User1');
      expect(result).toBe(true);
    });
  });

  describe('verifyAndGetUser', () => {
    it('should create a new user if the user is not registered', async () => {
      const user: Profile = {
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'http://example.com/photo.jpg',
      };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue({ id: 'new-user-id' });

      const result = await (authService as any).verifyAndGetUser(user);

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');

      expect(userService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          profileImage: 'http://example.com/photo.jpg',
        }),
      );

      expect(result).toEqual({ id: 'new-user-id' });
    });

    it('should return the registered user if the user is already registered', async () => {
      const user: Profile = {
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'http://example.com/photo.jpg',
      };

      const registeredUser = {
        id: 'registered-user-id',
        profileImage: 'http://example.com/photo.jpg',
      };

      mockUserService.findByEmail.mockResolvedValue(registeredUser);

      const result = await (authService as any).verifyAndGetUser(user);

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(registeredUser);
    });

    it('should update the profile image if it has changed', async () => {
      const user: Profile = {
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'http://example.com/new-photo.jpg',
      };

      const registeredUser = {
        id: 'registered-user-id',
        profileImage: 'http://example.com/old-photo.jpg',
        save: jest.fn(),
      };

      mockUserService.findByEmail.mockResolvedValue(registeredUser);

      const result = await (authService as any).verifyAndGetUser(user);

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');

      expect(registeredUser.profileImage).toEqual(
        'http://example.com/new-photo.jpg',
      );

      expect(registeredUser.save).toHaveBeenCalled();
      expect(result).toEqual(registeredUser);
    });
  });

  describe('createNewUser', () => undefined);
});
