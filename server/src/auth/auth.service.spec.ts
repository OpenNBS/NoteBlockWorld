import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '@server/user/user.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: 'FRONTEND_URL',
          useValue: 'FRONTEND_URL',
        },
        {
          provide: 'COOKIE_EXPIRES_IN',
          useValue: 'COOKIE_EXPIRES_IN',
        },
        {
          provide: 'JWT_SECRET',
          useValue: 'JWT_SECRET',
        },
        {
          provide: 'JWT_EXPIRES_IN',
          useValue: 'JWT_EXPIRES_IN',
        },
        {
          provide: 'JWT_REFRESH_SECRET',
          useValue: 'JWT_REFRESH_SECRET',
        },
        {
          provide: 'JWT_REFRESH_EXPIRES_IN',
          useValue: 'JWT_REFRESH_EXPIRES_IN',
        },
        {
          provide: 'WHITELISTED_USERS',
          useValue: 'WHITELISTED_USERS',
        },
        {
          provide: 'APP_DOMAIN',
          useValue: 'APP_DOMAIN',
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
