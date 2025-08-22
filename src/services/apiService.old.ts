import { 
  API_CONFIG, 
  ApiResponse, 
  LoginCredentials, 
  RegisterData, 
  User,
  ApiError
} from './types';
import { supabase } from '../config/supabase';
import { Session } from '@supabase/supabase-js';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Helper method to get auth headers with Supabase session
  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      ...API_CONFIG.HEADERS,
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    };
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || 'An error occurred',
          response.status,
          data.error,
          data.details
        );
      }

      if (!data.success) {
        throw new ApiError(
          data.error || 'Request failed',
          response.status,
          data.error,
          data.details
        );
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(
        'Network error or server unavailable',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // GET request
  private get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  private post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  private put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  private delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.post<{ user: User; tokens: AuthTokens }>('/auth/login', credentials);
    
    // Store tokens in localStorage
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

    return response;
  }

  async register(userData: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.post<{ user: User; tokens: AuthTokens }>('/auth/register', userData);
    
    // Store tokens in localStorage
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

    return response;
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.get<{ user: User }>('/auth/me');
  }

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new ApiError('No refresh token available', 401);
    }

    const response = await this.post<{ tokens: AuthTokens }>('/auth/refresh', { refreshToken });
    
    // Update stored tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refreshToken);

    return response.tokens;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // Get stored user data
  getStoredUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get<{ status: string; timestamp: string }>('/health');
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;

// Helper function for testing backend connection
export async function testBackendConnection(): Promise<{
  isConnected: boolean;
  status?: string;
  error?: string;
}> {
  try {
    const health = await apiService.healthCheck();
    return {
      isConnected: true,
      status: health.status,
    };
  } catch (error) {
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}
