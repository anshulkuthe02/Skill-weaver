import { supabase, auth } from '../config/supabase';
import { ApiError } from './types';
import { Session, User } from '@supabase/supabase-js';

interface AuthUser {
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

interface DbUser {
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

class AuthService {
  // Sign up with email and password
  async signUp(userData: SignUpData): Promise<{ user: AuthUser; session: Session }> {
    try {
      console.log('🔐 Attempting signup with:', userData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            username: userData.username
          }
        }
      });

      console.log('📊 Signup response:', { data, error });

      if (error) {
        console.error('❌ Signup error:', error);
        throw new ApiError(`Signup failed: ${error.message}`, 400, 'SIGNUP_ERROR');
      }

      if (!data.user) {
        throw new ApiError('Signup successful but no user returned. Check your email for verification.', 200, 'EMAIL_VERIFICATION_SENT');
      }

      // For email confirmation flow, data.session might be null
      if (!data.session) {
        console.log('📧 Email confirmation required');
        return {
          user: this.formatUser(data.user),
          session: {} as Session // Temporary session object
        };
      }

      // Create profile record after successful signup
      try {
        await this.updateUserProfile(data.user.id, {
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.username,
          email: userData.email
        });
      } catch (profileError) {
        console.warn('⚠️ Profile creation failed, but user was created:', profileError);
      }

      return {
        user: this.formatUser(data.user),
        session: data.session
      };
    } catch (error) {
      console.error('❌ Signup process failed:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Sign up failed', 500, 'SIGNUP_ERROR');
    }
  }

  // Sign in with email and password
  async signIn(credentials: SignInData): Promise<{ user: AuthUser; session: Session }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        throw new ApiError(error.message, 401, 'SIGNIN_ERROR');
      }

      if (!data.user || !data.session) {
        throw new ApiError('Sign in failed', 401, 'SIGNIN_FAILED');
      }

      return {
        user: this.formatUser(data.user),
        session: data.session
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Sign in failed', 500, 'SIGNIN_ERROR');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new ApiError(error.message, 500, 'SIGNOUT_ERROR');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Sign out failed', 500, 'SIGNOUT_ERROR');
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        throw new ApiError(error.message, 401, 'GET_USER_ERROR');
      }

      if (!user) {
        return null;
      }

      // Get additional user data from users table
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userDataError && userDataError.code !== 'PGRST116') {
        throw new ApiError('Failed to get user data', 500, 'USER_DATA_ERROR');
      }

      return this.formatUser(user, userData);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to get current user', 500, 'GET_USER_ERROR');
    }
  }

  // Get current session
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        throw new ApiError(error.message, 401, 'GET_SESSION_ERROR');
      }

      return session;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to get current session', 500, 'GET_SESSION_ERROR');
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<AuthUser>): Promise<AuthUser> {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new ApiError(error.message, 400, 'UPDATE_PROFILE_ERROR');
      }

      return this.formatUser(null, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update user profile', 500, 'UPDATE_PROFILE_ERROR');
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await auth.resetPassword(email);

      if (error) {
        throw new ApiError(error.message, 400, 'RESET_PASSWORD_ERROR');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to reset password', 500, 'RESET_PASSWORD_ERROR');
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await auth.updatePassword(newPassword);

      if (error) {
        throw new ApiError(error.message, 400, 'UPDATE_PASSWORD_ERROR');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update password', 500, 'UPDATE_PASSWORD_ERROR');
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return auth.onAuthStateChange(callback);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentSession();
  }

  // Helper method to format user data
  private formatUser(authUser?: User, dbUser?: DbUser): AuthUser {
    return {
      id: authUser?.id || dbUser?.id,
      email: authUser?.email || dbUser?.email,
      first_name: dbUser?.first_name || authUser?.user_metadata?.first_name,
      last_name: dbUser?.last_name || authUser?.user_metadata?.last_name,
      username: dbUser?.username || authUser?.user_metadata?.username,
      avatar_url: dbUser?.avatar_url || authUser?.user_metadata?.avatar_url,
      role: dbUser?.role || 'user',
      preferences: dbUser?.preferences || {},
      profile_data: dbUser?.profile_data || {}
    };
  }

  // Get user's recent activities
  async getRecentActivities(limit = 10) {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        throw new ApiError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { data, error } = await supabase
        .from('recent_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new ApiError(error.message, 500, 'GET_ACTIVITIES_ERROR');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to get recent activities', 500, 'GET_ACTIVITIES_ERROR');
    }
  }

  // Log user activity
  async logActivity(activityType: string, description: string, metadata: Record<string, unknown> = {}) {
    try {
      const user = await this.getCurrentUser();
      if (!user) return; // Don't log if user is not authenticated

      const { error } = await supabase
        .from('recent_activities')
        .insert([{
          user_id: user.id,
          activity_type: activityType,
          description,
          activity_data: metadata
        }]);

      if (error) {
        console.error('Failed to log activity:', error);
      }
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;
