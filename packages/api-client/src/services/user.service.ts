import type { 
  GetUser, 
  PageQueryDTO, 
  UpdateUsernameDto, 
  UserDocument 
} from '@nbw/database';

import { BaseApiClient } from '../base-client';
import type { ApiResponse } from '../types';

export class UserService extends BaseApiClient {
  /**
   * Get user by email or ID
   */
  async getUser(query: GetUser): Promise<ApiResponse<UserDocument>> {
    const searchParams = new URLSearchParams();
    if (query.email) searchParams.append('email', query.email);
    if (query.id) searchParams.append('id', query.id);
    
    return this.get(`/user?${searchParams.toString()}`);
  }

  /**
   * Get paginated list of users
   */
  async getUsersPaginated(query: PageQueryDTO): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (query.page !== undefined) searchParams.append('page', query.page.toString());
    if (query.limit !== undefined) searchParams.append('limit', query.limit.toString());
    if (query.sort) searchParams.append('sort', query.sort);
    if (query.order) searchParams.append('order', query.order);
    if (query.timespan) searchParams.append('timespan', query.timespan);

    return this.get(`/user?${searchParams.toString()}`);
  }

  /**
   * Get current authenticated user data
   */
  async getMe(): Promise<ApiResponse<UserDocument>> {
    return this.get('/user/me');
  }

  /**
   * Update the username of the current authenticated user
   */
  async updateUsername(data: UpdateUsernameDto): Promise<ApiResponse<UserDocument>> {
    return this.patch('/user/username', data);
  }
}
