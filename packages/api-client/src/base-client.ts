import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import type { ApiClientConfig, AuthTokens, ApiResponse, ApiError } from './types';

export class BaseApiClient {
  protected client: AxiosInstance;
  private authTokens: AuthTokens = {};

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth tokens
    this.client.interceptors.request.use(
      (config) => {
        if (this.authTokens.accessToken) {
          config.headers.Authorization = `Bearer ${this.authTokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          status : error.response?.status,
          code   : error.response?.data?.code,
        };
        return Promise.reject(apiError);
      }
    );
  }

  setAuthTokens(tokens: AuthTokens) {
    this.authTokens = tokens;
  }

  getAuthTokens(): AuthTokens {
    return { ...this.authTokens };
  }

  clearAuthTokens() {
    this.authTokens = {};
  }

  protected async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>(config);
      return {
        data      : response.data,
        status    : response.status,
        statusText: response.statusText,
        headers   : response.headers as Record<string, string>,
      };
    } catch (error) {
      throw error;
    }
  }

  protected async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  protected async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  protected async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  protected async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  protected async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}
