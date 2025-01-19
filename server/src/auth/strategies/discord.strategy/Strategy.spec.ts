import DiscordStrategy from './Strategy';
import { DiscordStrategyConfig } from './DiscordStrategyConfig';
import { VerifyFunction } from 'passport-oauth2';
import { DiscordPermissionScope, Profile } from './types';

describe('DiscordStrategy', () => {
  let strategy: DiscordStrategy;
  const verify: VerifyFunction = jest.fn();

  beforeEach(() => {
    const config: DiscordStrategyConfig = {
      clientID: 'test-client-id',
      clientSecret: 'test-client-secret',
      callbackUrl: 'http://localhost:3000/callback',
      scope: [DiscordPermissionScope.Email, DiscordPermissionScope.Identify],
      prompt: 'consent',
    };

    strategy = new DiscordStrategy(config, verify);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should have the correct name', () => {
    expect(strategy.name).toBe('discord');
  });

  it('should validate config', async () => {
    const config: DiscordStrategyConfig = {
      clientID: 'test-client-id',
      clientSecret: 'test-client-secret',
      callbackUrl: 'http://localhost:3000/callback',
      scope: [DiscordPermissionScope.Email, DiscordPermissionScope.Identify],
      prompt: 'consent',
    };

    await expect(strategy['validateConfig'](config)).resolves.toBeUndefined();
  });

  it('should make API request', async () => {
    const mockGet = jest.fn((url, accessToken, callback) => {
      callback(null, JSON.stringify({ id: '123' }));
    });

    strategy['_oauth2'].get = mockGet;

    const result = await strategy['makeApiRequest']<{ id: string }>(
      'https://discord.com/api/users/@me',
      'test-access-token',
    );

    expect(result).toEqual({ id: '123' });
  });

  it('should fetch user data', async () => {
    const mockMakeApiRequest = jest.fn().mockResolvedValue({ id: '123' });
    strategy['makeApiRequest'] = mockMakeApiRequest;

    const result = await strategy['fetchUserData']('test-access-token');

    expect(result).toEqual({ id: '123' });
  });

  it('should build profile', () => {
    const profileData = {
      id: '123',
      username: 'testuser',
      displayName: 'Test User',
      avatar: 'avatar.png',
      banner: 'banner.png',
      email: 'test@example.com',
      verified: true,
      mfa_enabled: true,
      public_flags: 1,
      flags: 1,
      locale: 'en-US',
      global_name: 'testuser#1234',
      premium_type: 1,
      connections: [],
      guilds: [],
    } as unknown as Profile;

    const profile = strategy['buildProfile'](profileData, 'test-access-token');

    expect(profile).toMatchObject({
      provider: 'discord',
      id: '123',
      username: 'testuser',
      displayName: 'Test User',
      avatar: 'avatar.png',
      banner: 'banner.png',
      email: 'test@example.com',
      verified: true,
      mfa_enabled: true,
      public_flags: 1,
      flags: 1,
      locale: 'en-US',
      global_name: 'testuser#1234',
      premium_type: 1,
      connections: [],
      guilds: [],
      access_token: 'test-access-token',
      fetchedAt: expect.any(Date),
      createdAt: expect.any(Date),
      _raw: JSON.stringify(profileData),
      _json: profileData,
    });
  });

  it('should fetch scope data', async () => {
    const mockMakeApiRequest = jest.fn().mockResolvedValue([{ id: '123' }]);
    strategy['makeApiRequest'] = mockMakeApiRequest;

    const result = await strategy['fetchScopeData'](
      'connections',
      'test-access-token',
    );

    expect(result).toEqual([{ id: '123' }]);
  });

  it('should enrich profile with scopes', async () => {
    const profile = {
      id: '123',
      connections: [],
      guilds: [],
    } as unknown as Profile;

    const mockFetchScopeData = jest
      .fn()
      .mockResolvedValueOnce([{ id: 'connection1' }])
      .mockResolvedValueOnce([{ id: 'guild1' }]);

    strategy['fetchScopeData'] = mockFetchScopeData;

    await strategy['enrichProfileWithScopes'](profile, 'test-access-token');

    expect(profile.connections).toEqual([{ id: 'connection1' }]);
    expect(profile.guilds).toEqual([{ id: 'guild1' }]);
    expect(profile.fetchedAt).toBeInstanceOf(Date);
  });

  it('should calculate creation date', () => {
    const id = '123456789012345678';
    const date = strategy['calculateCreationDate'](id);

    expect(date).toBeInstanceOf(Date);
  });

  it('should return authorization params', () => {
    const options = { prompt: 'consent' };
    const params = strategy.authorizationParams(options);

    expect(params).toMatchObject({
      prompt: 'consent',
    });
  });
});
