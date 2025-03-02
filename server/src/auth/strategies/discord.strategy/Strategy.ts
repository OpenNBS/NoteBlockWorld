import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  InternalOAuthError,
  Strategy as OAuth2Strategy,
  StrategyOptions as OAuth2StrategyOptions,
  VerifyCallback,
  VerifyFunction,
} from 'passport-oauth2';

import { DiscordStrategyConfig } from './DiscordStrategyConfig';
import {
  Profile,
  ProfileConnection,
  ProfileGuild,
  ScopeType,
  SingleScopeType,
} from './types';

interface AuthorizationParams {
  prompt?: string;
}

export default class Strategy extends OAuth2Strategy {
  // Static properties
  public static DISCORD_EPOCH = 1420070400000;
  public static DISCORD_SHIFT = 1 << 22;

  public static DISCORD_API_BASE = 'https://discord.com/api';

  private readonly logger = new Logger('DiscordStrategy');
  private scope: ScopeType;
  private scopeDelay: number;
  private fetchScopeEnabled: boolean;
  public override name = 'discord';
  prompt?: string;

  public constructor(options: DiscordStrategyConfig, verify: VerifyFunction) {
    super(
      {
        scopeSeparator: ' ',
        ...options,
        authorizationURL: 'https://discord.com/api/oauth2/authorize',
        tokenURL: 'https://discord.com/api/oauth2/token',
      } as OAuth2StrategyOptions,
      verify,
    );

    this.validateConfig(options);
    this.scope = options.scope;
    this.scopeDelay = options.scopeDelay ?? 0;
    this.fetchScopeEnabled = options.fetchScope ?? true;
    this._oauth2.useAuthorizationHeaderforGET(true);
    this.prompt = options.prompt;
  }

  private async validateConfig(config: DiscordStrategyConfig): Promise<void> {
    try {
      const validatedConfig = plainToClass(DiscordStrategyConfig, config);
      await validateOrReject(validatedConfig);
    } catch (errors) {
      this.logger.error(errors);
      throw new Error(`Configuration validation failed: ${errors}`);
    }
  }

  private async makeApiRequest<T>(
    url: string,
    accessToken: string,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this._oauth2.get(url, accessToken, (err, body) => {
        if (err) {
          reject(new InternalOAuthError(`Failed to fetch from ${url}`, err));
          return;
        }

        try {
          resolve(JSON.parse(body as string) as T);
        } catch (parseError) {
          reject(new Error(`Failed to parse response from ${url}`));
        }
      });
    });
  }

  private async fetchUserData(accessToken: string): Promise<Profile> {
    return this.makeApiRequest<Profile>(
      `${Strategy.DISCORD_API_BASE}/users/@me`,
      accessToken,
    );
  }

  public override async userProfile(accessToken: string, done: VerifyCallback) {
    try {
      const userData = await this.fetchUserData(accessToken);
      const profile = this.buildProfile(userData, accessToken);

      if (this.fetchScopeEnabled) {
        await this.enrichProfileWithScopes(profile, accessToken);
      }

      done(null, profile);
    } catch (error) {
      this.logger.error('Failed to fetch user profile', error);
      done(error);
    }
  }

  private async enrichProfileWithScopes(
    profile: Profile,
    accessToken: string,
  ): Promise<void> {
    await Promise.all([
      this.fetchScopeData('connections', accessToken).then(
        (data) => (profile.connections = data as ProfileConnection[]),
      ),
      this.fetchScopeData('guilds', accessToken).then(
        (data) => (profile.guilds = data as ProfileGuild[]),
      ),
    ]);

    profile.fetchedAt = new Date();
  }

  private async fetchScopeData(
    scope: SingleScopeType,
    accessToken: string,
  ): Promise<unknown[] | null> {
    if (!this.scope.includes(scope)) {
      return null;
    }

    if (this.scopeDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.scopeDelay));
    }

    return this.makeApiRequest<unknown[]>(
      `${Strategy.DISCORD_API_BASE}/users/@me/${scope}`,
      accessToken,
    );
  }

  private calculateCreationDate(id: string) {
    return new Date(+id / Strategy.DISCORD_SHIFT + Strategy.DISCORD_EPOCH);
  }

  private buildProfile(data: Profile, accessToken: string): Profile {
    const { id } = data;
    return {
      provider: 'discord',
      id: id,
      username: data.username,
      displayName: data.displayName,
      avatar: data.avatar,
      banner: data.banner,
      email: data.email,
      verified: data.verified,
      mfa_enabled: data.mfa_enabled,
      public_flags: data.public_flags,
      flags: data.flags,
      locale: data.locale,
      global_name: data.global_name,
      premium_type: data.premium_type,
      connections: data.connections,
      guilds: data.guilds,
      access_token: accessToken,
      fetchedAt: new Date(),
      createdAt: this.calculateCreationDate(id),
      _raw: JSON.stringify(data),
      _json: data as unknown as Record<string, unknown>,
    };
  }

  public fetchScope(
    scope: SingleScopeType,
    accessToken: string,
    callback: (err: Error | null, data: Record<string, unknown> | null) => void,
  ): void {
    // Early return if scope is not included
    if (!this.scope.includes(scope)) {
      callback(null, null);
      return;
    }

    // Handle scope delay
    const delayPromise = new Promise<void>((resolve) =>
      setTimeout(resolve, this.scopeDelay ?? 0),
    );

    delayPromise
      .then(() => {
        this._oauth2.get(
          `${Strategy.DISCORD_API_BASE}/users/@me/${scope}`,
          accessToken,
          (err, body) => {
            if (err) {
              this.logger.error(`Failed to fetch scope ${scope}:`, err);

              callback(
                new InternalOAuthError(`Failed to fetch scope: ${scope}`, err),
                null,
              );

              return;
            }

            try {
              if (typeof body !== 'string') {
                const error = new Error(
                  `Invalid response type for scope: ${scope}`,
                );

                this.logger.error(error.message);
                callback(error, null);
                return;
              }

              const json = JSON.parse(body) as Record<string, unknown>;
              callback(null, json);
            } catch (parseError) {
              const error =
                parseError instanceof Error
                  ? parseError
                  : new Error(`Failed to parse scope data: ${scope}`);

              this.logger.error('Parse error:', error);
              callback(error, null);
            }
          },
        );
      })
      .catch((error) => {
        this.logger.error('Unexpected error:', error);
        callback(error, null);
      });
  }

  public override authorizationParams(
    options: AuthorizationParams,
  ): AuthorizationParams & Record<string, unknown> {
    const params: AuthorizationParams & Record<string, unknown> =
      super.authorizationParams(options) as Record<string, unknown>;

    const { prompt } = this;
    if (prompt) params.prompt = prompt;

    console.log('Authorization Params');
    console.log('params', params);
    console.log('options', options);
    return params;
  }
}
