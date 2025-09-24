import { BaseApiClient } from '../base-client';
import type { ApiResponse } from '../types';

export interface MagicLinkRequest {
  destination: string;
}

export interface AuthVerifyResponse {
  verified: boolean;
  user?: any;
}

export class AuthService extends BaseApiClient {
  /**
   * Send a magic link to the user's email for authentication
   */
  async sendMagicLink(request: MagicLinkRequest): Promise<ApiResponse<void>> {
    return this.post('/auth/login/magic-link', request);
  }

  /**
   * Verify the user's authentication token
   */
  async verifyToken(): Promise<ApiResponse<AuthVerifyResponse>> {
    return this.get('/auth/verify');
  }

  /**
   * Redirect to GitHub OAuth login
   */
  getGitHubLoginUrl(): string {
    return `${this.client.defaults.baseURL}/auth/login/github`;
  }

  /**
   * Redirect to Google OAuth login  
   */
  getGoogleLoginUrl(): string {
    return `${this.client.defaults.baseURL}/auth/login/google`;
  }

  /**
   * Redirect to Discord OAuth login
   */
  getDiscordLoginUrl(): string {
    return `${this.client.defaults.baseURL}/auth/login/discord`;
  }
}
