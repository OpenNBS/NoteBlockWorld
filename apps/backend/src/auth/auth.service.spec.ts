import { beforeEach, describe, expect, it, jest, mock, spyOn } from 'bun:test';

import type { UserDocument } from '@nbw/database';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@server/user/user.service';
import type { Request, Response } from 'express';


import { AuthService } from './auth.service';
import { Profile } from './types/profile';

const mockAxios = {
  get   : jest.fn(),
  post  : jest.fn(),
  put   : jest.fn(),
  delete: jest.fn(),
  create: jest.fn()
};

mock.module('axios', () => mockAxios);

const mockUserService = {
  generateUsername: jest.fn(),
  findByEmail     : jest.fn(),
  findByID        : jest.fn(),
  create          : jest.fn()
};

const mockJwtService = {
  decode   : jest.fn(),
  signAsync: jest.fn(),
  verify   : jest.fn()
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
          provide : UserService,
          useValue: mockUserService
        },
        {
          provide : JwtService,
          useValue: mockJwtService
        },
        {
          provide : 'COOKIE_EXPIRES_IN',
          useValue: '3600'
        },
        {
          provide : 'FRONTEND_URL',
          useValue: 'http://frontend.test.com'
        },
        {
          provide : 'COOKIE_EXPIRES_IN',
          useValue: '3600'
        },
        {
          provide : 'JWT_SECRET',
          useValue: 'test-jwt-secret'
        },
        {
          provide : 'JWT_EXPIRES_IN',
          useValue: '1d'
        },
        {
          provide : 'JWT_REFRESH_SECRET',
          useValue: 'test-jwt-refresh-secret'
        },
        {
          provide : 'JWT_REFRESH_EXPIRES_IN',
          useValue: '7d'
        },
        {
          provide : 'WHITELISTED_USERS',
          useValue: 'tomast1337,bentroen,testuser'
        },
        {
          provide : 'APP_DOMAIN',
          useValue: '.test.com'
        }
      ]
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
        json  : jest.fn()
      } as any;

      await authService.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: 'No authorization header'
      });
    });

    it('should throw an error if no token is provided', async () => {
      const req = { headers: { authorization: 'Bearer ' } } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json  : jest.fn()
      } as any;

      await authService.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    });

    it('should throw an error if user is not found', async () => {
      const req = {
        headers: { authorization: 'Bearer test-token' }
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json  : jest.fn()
      } as any;

      mockJwtService.verify.mockReturnValueOnce({ id: 'test-id' });
      mockUserService.findByID.mockResolvedValueOnce(null);

      await authService.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return decoded token if user is found', async () => {
      const req = {
        headers: { authorization: 'Bearer test-token' }
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json  : jest.fn()
      } as any;

      const decodedToken = { id: 'test-id' };
      mockJwtService.verify.mockReturnValueOnce(decodedToken);
      mockUserService.findByID.mockResolvedValueOnce({ id: 'test-id' });

      const result = await authService.verifyToken(req, res);
      expect(result).toEqual(decodedToken);
    });
  });

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
      expect(result).toEqual({ id: 'test-id' } as UserDocument);
    });
  });

  describe('createJwtPayload', () => {
    it('should create access and refresh tokens', async () => {
      const payload = { id: 'user-id', username: 'testuser' };
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      spyOn(jwtService, 'signAsync').mockImplementation(
        (payload, options: any) => {
          if (options.secret === 'test-jwt-secret') {
            return Promise.resolve(accessToken);
          } else if (options.secret === 'test-jwt-refresh-secret') {
            return Promise.resolve(refreshToken);
          }

          return Promise.reject(new Error('Invalid secret'));
        }
      );

      const tokens = await (authService as any).createJwtPayload(payload);

      expect(tokens).toEqual({
        access_token : accessToken,
        refresh_token: refreshToken
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret   : 'test-jwt-secret',
        expiresIn: '1d'
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret   : 'test-jwt-refresh-secret',
        expiresIn: '7d'
      });
    });
  });

  describe('GenTokenRedirect', () => {
    it('should set cookies and redirect to the frontend URL', async () => {
      const user_registered = {
        _id     : 'user-id',
        email   : 'test@example.com',
        username: 'testuser'
      } as unknown as UserDocument;

      const res = {
        cookie  : jest.fn(),
        redirect: jest.fn()
      } as unknown as Response;

      const tokens = {
        access_token : 'access-token',
        refresh_token: 'refresh-token'
      };

      spyOn(authService as any, 'createJwtPayload').mockResolvedValue(tokens);

      await (authService as any).GenTokenRedirect(user_registered, res);

      expect((authService as any).createJwtPayload).toHaveBeenCalledWith({
        id      : 'user-id',
        email   : 'test@example.com',
        username: 'testuser'
      });

      expect(res.cookie).toHaveBeenCalledWith('token', 'access-token', {
        domain: '.test.com',
        maxAge: 3600000
      });

      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-token',
        {
          domain: '.test.com',
          maxAge: 3600000
        }
      );

      expect(res.redirect).toHaveBeenCalledWith('http://frontend.test.com/');
    });
  });

  describe('verifyAndGetUser', () => {
    it('should create a new user if the user is not registered', async () => {
      const user: Profile = {
        username    : 'testuser',
        email       : 'test@example.com',
        profileImage: 'http://example.com/photo.jpg'
      };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue({ id: 'new-user-id' });

      const result = await (authService as any).verifyAndGetUser(user);

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');

      expect(userService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email       : 'test@example.com',
          profileImage: 'http://example.com/photo.jpg'
        })
      );

      expect(result).toEqual({ id: 'new-user-id' });
    });

    it('should return the registered user if the user is already registered', async () => {
      const user: Profile = {
        username    : 'testuser',
        email       : 'test@example.com',
        profileImage: 'http://example.com/photo.jpg'
      };

      const registeredUser = {
        id          : 'registered-user-id',
        profileImage: 'http://example.com/photo.jpg'
      };

      mockUserService.findByEmail.mockResolvedValue(registeredUser);

      const result = await (authService as any).verifyAndGetUser(user);

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(registeredUser);
    });

    it('should update the profile image if it has changed', async () => {
      const user: Profile = {
        username    : 'testuser',
        email       : 'test@example.com',
        profileImage: 'http://example.com/new-photo.jpg'
      };

      const registeredUser = {
        id          : 'registered-user-id',
        profileImage: 'http://example.com/old-photo.jpg',
        save        : jest.fn()
      };

      mockUserService.findByEmail.mockResolvedValue(registeredUser);

      const result = await (authService as any).verifyAndGetUser(user);

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');

      expect(registeredUser.profileImage).toEqual(
        'http://example.com/new-photo.jpg'
      );

      expect(registeredUser.save).toHaveBeenCalled();
      expect(result).toEqual(registeredUser);
    });
  });

  describe('createNewUser', () => undefined);
});
