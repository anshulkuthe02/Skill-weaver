// Admin Authentication Service - Uses backend admin routes to bypass Supabase restrictions
import { ApiError } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
}

interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: AuthUser;
    session?: AuthSession;
    profile?: Record<string, unknown>;
  };
  error?: string;
}

export class AdminAuthService {
  
  /**
   * Test admin connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔧 Testing admin auth connection...');
      
      const response = await fetch(`${API_BASE_URL}/auth-admin/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Admin auth connection successful');
        console.log(`📊 Current users in system: ${result.userCount}`);
        return true;
      } else {
        console.error('❌ Admin auth connection failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Admin auth connection error:', error);
      return false;
    }
  }

  /**
   * Sign up using admin API (bypasses email validation issues)
   */
  static async signUp(signUpData: SignUpData): Promise<AuthResponse> {
    try {
      console.log('🔐 Admin signup for:', signUpData.email);
      
      const response = await fetch(`${API_BASE_URL}/auth-admin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new ApiError(
          result.message || 'Signup failed',
          response.status,
          result.error?.code || 'signup_failed'
        );
      }

      console.log('✅ Admin signup successful');
      return result;
      
    } catch (error) {
      console.error('❌ Admin signup failed:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        'Network error during signup',
        500,
        'network_error'
      );
    }
  }

  /**
   * Sign in user
   */
  static async signIn(signInData: SignInData): Promise<AuthResponse> {
    try {
      console.log('🔐 Admin signin for:', signInData.email);
      
      const response = await fetch(`${API_BASE_URL}/auth-admin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signInData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new ApiError(
          result.message || 'Sign in failed',
          response.status,
          result.error?.code || 'signin_failed'
        );
      }

      console.log('✅ Admin signin successful');
      return result;
      
    } catch (error) {
      console.error('❌ Admin signin failed:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        'Network error during sign in',
        500,
        'network_error'
      );
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<AuthResponse> {
    try {
      console.log('🔐 Admin signout');
      
      const response = await fetch(`${API_BASE_URL}/auth-admin/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new ApiError(
          result.message || 'Sign out failed',
          response.status,
          'signout_failed'
        );
      }

      console.log('✅ Admin signout successful');
      return result;
      
    } catch (error) {
      console.error('❌ Admin signout failed:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        'Network error during sign out',
        500,
        'network_error'
      );
    }
  }

  /**
   * Get current user session (placeholder for client-side session management)
   */
  static async getCurrentUser(): Promise<{ user: AuthUser; session: AuthSession } | null> {
    // This would typically check localStorage or sessionStorage for user data
    // For now, return null - implement session management as needed
    try {
      const userJson = localStorage.getItem('supabase.auth.token');
      if (userJson) {
        return JSON.parse(userJson);
      }
    } catch (error) {
      console.warn('Could not retrieve user from localStorage:', error);
    }
    return null;
  }

  /**
   * Save user session to localStorage
   */
  static saveUserSession(user: AuthUser, session: AuthSession): void {
    try {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        user,
        session,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Could not save user session:', error);
    }
  }

  /**
   * Clear user session
   */
  static clearUserSession(): void {
    try {
      localStorage.removeItem('supabase.auth.token');
    } catch (error) {
      console.warn('Could not clear user session:', error);
    }
  }
}

export default AdminAuthService;
