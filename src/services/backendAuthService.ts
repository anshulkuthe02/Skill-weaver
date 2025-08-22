import { ApiError } from './types';

export interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthUser {
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

class BackendAuthService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Sign up with backend API
  async signUp(userData: SignUpData): Promise<{ user: AuthUser; message: string }> {
    try {
      console.log('🔐 Backend signup request:', userData.email);

      const response = await fetch(`${this.baseUrl}/auth-simple/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      console.log('📊 Backend signup response:', result);

      if (!response.ok) {
        throw new ApiError(result.message || 'Signup failed', response.status);
      }

      if (!result.success) {
        throw new ApiError(result.message || 'Signup failed', 400);
      }

      return {
        user: {
          id: result.data.user.id,
          email: result.data.user.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.username
        },
        message: result.message
      };

    } catch (error) {
      console.error('❌ Backend signup error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Unable to connect to server. Please check if the backend is running.', 500);
      }
      throw new ApiError('Signup failed', 500);
    }
  }

  // Sign in with backend API
  async signIn(credentials: SignInData): Promise<{ user: AuthUser; session: Record<string, unknown> }> {
    try {
      console.log('🔐 Backend signin request:', credentials.email);

      const response = await fetch(`${this.baseUrl}/auth-simple/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();
      console.log('📊 Backend signin response:', result);

      if (!response.ok) {
        throw new ApiError(result.message || 'Sign in failed', response.status);
      }

      if (!result.success) {
        throw new ApiError(result.message || 'Sign in failed', 401);
      }

      return {
        user: result.data.user,
        session: result.data.session
      };

    } catch (error) {
      console.error('❌ Backend signin error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Unable to connect to server. Please check if the backend is running.', 500);
      }
      throw new ApiError('Sign in failed', 500);
    }
  }

  // Test backend connection
  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth-simple/test`);
      const result = await response.json();

      return {
        connected: result.success,
        message: result.message
      };
    } catch (error) {
      return {
        connected: false,
        message: 'Backend connection failed'
      };
    }
  }
}

export const backendAuthService = new BackendAuthService();
export default backendAuthService;
