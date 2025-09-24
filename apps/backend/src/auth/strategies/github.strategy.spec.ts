import { describe, beforeEach, it, expect, jest } from 'bun:test';

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { GithubStrategy } from './github.strategy';

describe('GithubStrategy', () => {
    let githubStrategy: GithubStrategy;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GithubStrategy,
                {
                    provide : ConfigService,
                    useValue: {
                        getOrThrow: jest.fn((key: string) => {
                            switch (key) {
                                case 'GITHUB_CLIENT_ID':
                                    return 'test-client-id';
                                case 'GITHUB_CLIENT_SECRET':
                                    return 'test-client-secret';
                                case 'SERVER_URL':
                                    return 'http://localhost:3000';
                                default:
                                    return null;
                            }
                        })
                    }
                }
            ]
        }).compile();

        githubStrategy = module.get<GithubStrategy>(GithubStrategy);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(githubStrategy).toBeDefined();
    });

    describe('constructor', () => {
        it('should throw an error if GitHub config is missing', () => {
            jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(null);

            expect(() => new GithubStrategy(configService)).toThrowError(
                'OAuth2Strategy requires a clientID option'
            );
        });
    });

    describe('validate', () => {
        it('should return accessToken, refreshToken, and profile', async () => {
            const accessToken = 'test-access-token';
            const refreshToken = 'test-refresh-token';
            const profile = { id: 'test-id', displayName: 'Test User' };

            const result = await githubStrategy.validate(
                accessToken,
                refreshToken,
                profile
            );

            expect(result).toEqual({ accessToken, refreshToken, profile });
        });
    });
});
