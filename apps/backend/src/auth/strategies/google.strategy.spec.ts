import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { VerifyCallback } from 'passport-google-oauth20';

import { GoogleStrategy } from './google.strategy';

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide : ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              switch (key) {
                case 'GOOGLE_CLIENT_ID':
                  return 'test-client-id';
                case 'GOOGLE_CLIENT_SECRET':
                  return 'test-client-secret';
                case 'SERVER_URL':
                  return 'http://localhost:3000';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    googleStrategy = module.get<GoogleStrategy>(GoogleStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(googleStrategy).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw an error if Google config is missing', () => {
      jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(null);

      expect(() => new GoogleStrategy(configService)).toThrowError(
        'OAuth2Strategy requires a clientID option',
      );
    });
  });

  describe('validate', () => {
    it('should call done with profile', () => {
      const accessToken = 'test-access-token';
      const refreshToken = 'test-refresh-token';
      const profile = { id: 'test-id', displayName: 'Test User' };
      const done: VerifyCallback = jest.fn();

      googleStrategy.validate(accessToken, refreshToken, profile, done);

      expect(done).toHaveBeenCalledWith(null, profile);
    });
  });
});
