import { describe, beforeEach, it, expect, jest } from 'bun:test';

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request } from 'express';

import { JwtStrategy } from './JWT.strategy';

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide : ConfigService,
                    useValue: {
                        getOrThrow: jest.fn().mockReturnValue('test-secret')
                    }
                }
            ]
        }).compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(jwtStrategy).toBeDefined();
    });

    describe('constructor', () => {
        it('should throw an error if JWT_SECRET is not set', () => {
            jest.spyOn(configService, 'getOrThrow').mockReturnValue(null);

            expect(() => new JwtStrategy(configService)).toThrowError(
                'JwtStrategy requires a secret or key'
            );
        });
    });

    describe('validate', () => {
        it('should return payload with refreshToken from header', () => {
            const req = {
                headers: {
                    authorization: 'Bearer test-refresh-token'
                },
                cookies: {}
            } as unknown as Request;

            const payload = { userId: 'test-user-id' };

            const result = jwtStrategy.validate(req, payload);

            expect(result).toEqual({
                ...payload,
                refreshToken: 'test-refresh-token'
            });
        });

        it('should return payload with refreshToken from cookie', () => {
            const req = {
                headers: {},
                cookies: {
                    refresh_token: 'test-refresh-token'
                }
            } as unknown as Request;

            const payload = { userId: 'test-user-id' };

            const result = jwtStrategy.validate(req, payload);

            expect(result).toEqual({
                ...payload,
                refreshToken: 'test-refresh-token'
            });
        });

        it('should throw an error if no refresh token is provided', () => {
            const req = {
                headers: {},
                cookies: {}
            } as unknown as Request;

            const payload = { userId: 'test-user-id' };

            expect(() => jwtStrategy.validate(req, payload)).toThrowError(
                'No refresh token'
            );
        });
    });
});
