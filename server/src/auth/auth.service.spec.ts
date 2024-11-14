import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { Request } from 'express';

import { UserService } from '@server/user/user.service';

import { AuthService } from './auth.service';

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

  describe('googleLogin', () => undefined); // TODO: implement tests for googleLogin

  describe('githubLogin', () => undefined); // TODO: implement tests for githubLogin

  describe('discordLogin', () => undefined); // TODO: implement tests for discordLogin

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
