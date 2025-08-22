import { supabase } from '../config/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
  role?: string;
  preferences?: Record<string, unknown>;
  profile_data?: Record<string, unknown>;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 0,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  // Helper method to get current session
  private async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  // Helper method to get auth headers
  private async getAuthHeaders(): Promise<HeadersInit> {
    const session = await this.getSession();
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    };
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const authHeaders = await this.getAuthHeaders();
    const config: RequestInit = {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(
          `HTTP ${response.status}: ${errorText}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // Authentication methods using Supabase
  async login(credentials: LoginCredentials): Promise<{ user: User; session: Session }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new ApiError(error.message, 400);
    }

    if (!data.user || !data.session) {
      throw new ApiError('Authentication failed', 400);
    }

    const user = await this.transformSupabaseUser(data.user);
    return { user, session: data.session };
  }

  async register(userData: RegisterData): Promise<{ user: User; session: Session }> {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.username,
        }
      }
    });

    if (error) {
      throw new ApiError(error.message, 400);
    }

    if (!data.user || !data.session) {
      throw new ApiError('Registration failed', 400);
    }

    const user = await this.transformSupabaseUser(data.user);
    return { user, session: data.session };
  }

  async getCurrentUser(): Promise<User> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      throw new ApiError('Not authenticated', 401);
    }

    return this.transformSupabaseUser(user);
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new ApiError(error.message, 400);
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  }

  // Transform Supabase user to our User interface
  private async transformSupabaseUser(supabaseUser: SupabaseUser): Promise<User> {
    // Try to get additional user data from our users table
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      first_name: userData?.first_name || supabaseUser.user_metadata?.first_name,
      last_name: userData?.last_name || supabaseUser.user_metadata?.last_name,
      username: userData?.username || supabaseUser.user_metadata?.username,
      avatar_url: userData?.avatar_url || supabaseUser.user_metadata?.avatar_url,
      role: userData?.role || 'user',
      preferences: userData?.preferences || {},
      profile_data: userData?.profile_data || {}
    };
  }

  // Portfolio methods
  async getPortfolios(): Promise<any[]> {
    const response = await this.request<{ data: any[] }>('/portfolios');
    return response.data || [];
  }

  async createPortfolio(portfolioData: any): Promise<any> {
    const response = await this.request<{ data: any }>('/portfolios', {
      method: 'POST',
      body: JSON.stringify(portfolioData),
    });
    return response.data;
  }

  async updatePortfolio(id: string, portfolioData: any): Promise<any> {
    const response = await this.request<{ data: any }>(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(portfolioData),
    });
    return response.data;
  }

  async deletePortfolio(id: string): Promise<void> {
    await this.request(`/portfolios/${id}`, {
      method: 'DELETE',
    });
  }

  // Template methods
  async getTemplates(): Promise<any[]> {
    const response = await this.request<{ data: any[] }>('/templates');
    return response.data || [];
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
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

export { ApiError };
export type { User, LoginCredentials, RegisterData };
