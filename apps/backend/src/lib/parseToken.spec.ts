import { jest, describe, beforeEach, expect, it } from 'bun:test';

import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '@server/auth/auth.service';

import { ParseTokenPipe } from './parseToken';

describe('ParseTokenPipe', () => {
    let parseTokenPipe: ParseTokenPipe;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ParseTokenPipe,
                {
                    provide : AuthService,
                    useValue: {
                        getUserFromToken: jest.fn()
                    }
                }
            ]
        }).compile();

        parseTokenPipe = module.get<ParseTokenPipe>(ParseTokenPipe);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(parseTokenPipe).toBeDefined();
    });

    describe('canActivate', () => {
        it('should return true if no authorization header is present', async () => {
            const mockExecutionContext = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest  : jest.fn().mockReturnValue({ headers: {} })
            } as unknown as ExecutionContext;

            const result = await parseTokenPipe.canActivate(mockExecutionContext);

            expect(result).toBe(true);
        });

        it('should return true if user is not found from token', async () => {
            const mockExecutionContext = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest  : jest.fn().mockReturnValue({
                    headers: { authorization: 'Bearer test-token' }
                })
            } as unknown as ExecutionContext;

            jest.spyOn(authService, 'getUserFromToken').mockResolvedValue(null);

            const result = await parseTokenPipe.canActivate(mockExecutionContext);

            expect(result).toBe(true);
            expect(authService.getUserFromToken).toHaveBeenCalledWith('test-token');
        });

        it('should set existingUser on request and return true if user is found from token', async () => {
            const mockUser = { _id: 'test-id', username: 'testuser' } as any;

            const mockExecutionContext = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest  : jest.fn().mockReturnValue({
                    headers     : { authorization: 'Bearer test-token' },
                    existingUser: null
                })
            } as unknown as ExecutionContext;

            jest.spyOn(authService, 'getUserFromToken').mockResolvedValue(mockUser);

            const result = await parseTokenPipe.canActivate(mockExecutionContext);

            expect(result).toBe(true);
            expect(authService.getUserFromToken).toHaveBeenCalledWith('test-token');

            expect(
                mockExecutionContext.switchToHttp().getRequest().existingUser
            ).toEqual(mockUser);
        });
    });
});
