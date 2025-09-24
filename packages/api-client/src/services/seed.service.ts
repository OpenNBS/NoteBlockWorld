import { BaseApiClient } from '../base-client';
import type { ApiResponse } from '../types';

export interface SeedResponse {
  message: string;
}

export class SeedService extends BaseApiClient {
  /**
   * Seed the database with development data
   */
  async seedDev(): Promise<ApiResponse<SeedResponse>> {
    return this.get('/seed/seed-dev');
  }
}
