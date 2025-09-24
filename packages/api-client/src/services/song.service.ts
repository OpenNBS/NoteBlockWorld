import type { 
  PageQueryDTO, 
  SongPreviewDto, 
  SongViewDto, 
  UploadSongDto, 
  UploadSongResponseDto,
  PageDto,
  SongPageDto
} from '@nbw/database';

import { BaseApiClient } from '../base-client';
import type { ApiResponse } from '../types';

export interface SongQueryParams extends PageQueryDTO {
  q?: 'featured' | 'recent' | 'categories' | 'random';
  id?: string; // Category ID for q=categories
  count?: number; // For q=random (1-10)
  category?: string; // Category filter for q=random
}

export class SongService extends BaseApiClient {
  /**
   * Get songs with various filtering and browsing options
   */
  async getSongs(query: SongQueryParams = {}): Promise<ApiResponse<PageDto<SongPreviewDto> | SongPreviewDto[] | Record<string, number>>> {
    const searchParams = new URLSearchParams();
    
    // Standard pagination parameters
    if (query.page !== undefined) searchParams.append('page', query.page.toString());
    if (query.limit !== undefined) searchParams.append('limit', query.limit.toString());
    if (query.sort) searchParams.append('sort', query.sort);
    if (query.order) searchParams.append('order', query.order);
    if (query.timespan) searchParams.append('timespan', query.timespan);
    
    // Special query parameters
    if (query.q) searchParams.append('q', query.q);
    if (query.id) searchParams.append('id', query.id);
    if (query.count !== undefined) searchParams.append('count', query.count.toString());
    if (query.category) searchParams.append('category', query.category);

    return this.get(`/song?${searchParams.toString()}`);
  }

  /**
   * Search songs by keywords with pagination and sorting
   */
  async searchSongs(query: PageQueryDTO, searchQuery: string): Promise<ApiResponse<PageDto<SongPreviewDto>>> {
    const searchParams = new URLSearchParams();
    
    if (query.page !== undefined) searchParams.append('page', query.page.toString());
    if (query.limit !== undefined) searchParams.append('limit', query.limit.toString());
    if (query.sort) searchParams.append('sort', query.sort);
    if (query.order) searchParams.append('order', query.order);
    if (query.timespan) searchParams.append('timespan', query.timespan);
    if (searchQuery) searchParams.append('q', searchQuery);

    return this.get(`/song/search?${searchParams.toString()}`);
  }

  /**
   * Get song info by ID
   */
  async getSong(id: string): Promise<ApiResponse<SongViewDto>> {
    return this.get(`/song/${id}`);
  }

  /**
   * Get song info for editing by ID (requires authentication)
   */
  async getSongForEdit(id: string): Promise<ApiResponse<UploadSongDto>> {
    return this.get(`/song/${id}/edit`);
  }

  /**
   * Edit song info by ID (requires authentication)
   */
  async updateSong(id: string, data: UploadSongDto): Promise<ApiResponse<UploadSongResponseDto>> {
    return this.patch(`/song/${id}/edit`, data);
  }

  /**
   * Get song download URL (redirects to file)
   */
  getSongDownloadUrl(id: string, src?: string): string {
    const searchParams = new URLSearchParams();
    if (src) searchParams.append('src', src);
    return `${this.client.defaults.baseURL}/song/${id}/download?${searchParams.toString()}`;
  }

  /**
   * Get song open URL
   */
  async getSongOpenUrl(id: string): Promise<ApiResponse<string>> {
    return this.get(`/song/${id}/open`, {
      headers: {
        'src': 'downloadButton'
      }
    });
  }

  /**
   * Delete a song (requires authentication)
   */
  async deleteSong(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/song/${id}`);
  }

  /**
   * Upload a new song (requires authentication)
   */
  async uploadSong(file: File, data: UploadSongDto): Promise<ApiResponse<UploadSongResponseDto>> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Append all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    });

    return this.post('/song', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get songs uploaded by the current authenticated user
   */
  async getMySongs(query: PageQueryDTO = {}): Promise<ApiResponse<SongPageDto>> {
    const searchParams = new URLSearchParams();
    
    if (query.page !== undefined) searchParams.append('page', query.page.toString());
    if (query.limit !== undefined) searchParams.append('limit', query.limit.toString());
    if (query.sort) searchParams.append('sort', query.sort);
    if (query.order) searchParams.append('order', query.order);
    if (query.timespan) searchParams.append('timespan', query.timespan);

    return this.get(`/my-songs?${searchParams.toString()}`);
  }
}
