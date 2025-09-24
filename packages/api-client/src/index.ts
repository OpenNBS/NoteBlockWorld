// Main API Client
export { NoteBlockWorldApiClient } from './api-client';

// Base client for custom extensions
export { BaseApiClient } from './base-client';

// Individual services for modular usage
export { AuthService } from './services/auth.service';
export { UserService } from './services/user.service';
export { SongService } from './services/song.service';
export { SeedService } from './services/seed.service';

// Types and interfaces
export type {
  ApiClientConfig,
  AuthTokens,
  ApiResponse,
  ApiError,
} from './types';

export type { MagicLinkRequest, AuthVerifyResponse } from './services/auth.service';
export type { SongQueryParams } from './services/song.service';
export type { SeedResponse } from './services/seed.service';

// Re-export relevant database types for convenience
export type {
  PageQueryDTO,
  PageDto,
  SongPreviewDto,
  SongViewDto,
  SongPageDto,
  UploadSongDto,
  UploadSongResponseDto,
  FeaturedSongsDto,
  UserDocument,
  GetUser,
  UpdateUsernameDto,
} from '@nbw/database';

// Factory function for easy client creation
export function createApiClient(config: ApiClientConfig): NoteBlockWorldApiClient {
  return new NoteBlockWorldApiClient(config);
}

// Default configuration helper
export function createDefaultConfig(baseURL: string): ApiClientConfig {
  return {
    baseURL: baseURL.endsWith('/') ? `${baseURL}v1` : `${baseURL}/v1`,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
