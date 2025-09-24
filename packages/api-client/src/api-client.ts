import { BaseApiClient } from './base-client';
import { AuthService } from './services/auth.service';
import { SeedService } from './services/seed.service';
import { SongService } from './services/song.service';
import { UserService } from './services/user.service';
import type { ApiClientConfig, AuthTokens } from './types';

export class NoteBlockWorldApiClient extends BaseApiClient {
  public readonly auth: AuthService;
  public readonly user: UserService;
  public readonly song: SongService;
  public readonly seed: SeedService;

  constructor(config: ApiClientConfig) {
    super(config);
    
    // Initialize all service instances with the same config
    this.auth = new AuthService(config);
    this.user = new UserService(config);
    this.song = new SongService(config);
    this.seed = new SeedService(config);
  }

  /**
   * Set authentication tokens for all services
   */
  setAuthTokens(tokens: AuthTokens): void {
    super.setAuthTokens(tokens);
    this.auth.setAuthTokens(tokens);
    this.user.setAuthTokens(tokens);
    this.song.setAuthTokens(tokens);
    this.seed.setAuthTokens(tokens);
  }

  /**
   * Clear authentication tokens from all services
   */
  clearAuthTokens(): void {
    super.clearAuthTokens();
    this.auth.clearAuthTokens();
    this.user.clearAuthTokens();
    this.song.clearAuthTokens();
    this.seed.clearAuthTokens();
  }

  /**
   * Get authentication tokens
   */
  getAuthTokens(): AuthTokens {
    return super.getAuthTokens();
  }
}
