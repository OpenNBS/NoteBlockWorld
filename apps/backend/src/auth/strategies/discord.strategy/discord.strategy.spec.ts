import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { DiscordStrategy } from './index';

describe('DiscordStrategy', () => {
  let discordStrategy: DiscordStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordStrategy,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              switch (key) {
                case 'DISCORD_CLIENT_ID':
                  return 'test-client-id';
                case 'DISCORD_CLIENT_SECRET':
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

    discordStrategy = module.get<DiscordStrategy>(DiscordStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(discordStrategy).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw an error if Discord config is missing', () => {
      jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(null);

      expect(() => new DiscordStrategy(configService)).toThrowError(
        'OAuth2Strategy requires a clientID option',
      );
    });
  });

  describe('validate', () => {
    it('should return accessToken, refreshToken, and profile', async () => {
      const accessToken = 'test-access-token';
      const refreshToken = 'test-refresh-token';
      const profile = { id: 'test-id', username: 'Test User' };

      const result = await discordStrategy.validate(
        accessToken,
        refreshToken,
        profile,
      );

      expect(result).toEqual({ accessToken, refreshToken, profile });
    });
  });
});
