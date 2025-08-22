import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AdminAuthService } from '../services/adminAuthService';
import { AuthUser, AuthContextType, UserSignUpData, AuthSession } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session from localStorage
    const getInitialSession = async () => {
      try {
        setLoading(true);
        
        // Check for stored user session
        const storedUser = await AdminAuthService.getCurrentUser();
        if (storedUser?.user) {
          console.log('Found stored user session:', storedUser.user.email);
          setUser({
            id: storedUser.user.id,
            email: storedUser.user.email,
            first_name: storedUser.user.user_metadata?.first_name as string,
            last_name: storedUser.user.user_metadata?.last_name as string,
            username: storedUser.user.user_metadata?.username as string
          });
          setSession(storedUser.session);
        } else {
          console.log('No stored user session found');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Test admin auth connection on startup
    AdminAuthService.testConnection().then(connected => {
      if (connected) {
        console.log('✅ Admin auth service is ready');
      } else {
        console.warn('⚠️ Admin auth service connection failed');
      }
    });

    // Note: Supabase auth state changes are not used with AdminAuthService
    // Session management is handled manually via localStorage
  }, []);

  const signUp = async (email: string, password: string, userData?: UserSignUpData) => {
    try {
      setLoading(true);
      
      console.log('🔐 Starting signup process with admin auth service...');
      
      const { data } = await AdminAuthService.signUp({
        email,
        password,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        username: userData?.username
      });

      if (data?.user) {
        console.log('✅ User created successfully:', data.user.email);
        
        // Set user state
        setUser({
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          username: data.user.username
        });
      }

      console.log('✅ Signup completed successfully');
    } catch (error) {
      console.error('❌ Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      console.log('🔐 Starting signin process with admin auth service...');
      
      const { data } = await AdminAuthService.signIn({
        email,
        password
      });
      
      if (data?.user) {
        console.log('✅ User signed in successfully:', data.user.email);
        
        // Set user and session state
        setUser({
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.user_metadata?.first_name as string,
          last_name: data.user.user_metadata?.last_name as string,
          username: data.user.user_metadata?.username as string
        });
        
        setSession(data.session as AuthSession);
        
        // Save session to localStorage for persistence
        AdminAuthService.saveUserSession(data.user, data.session);
      }
      
      console.log('✅ Signin completed successfully');
    } catch (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      console.log('🔐 Starting signout process...');
      
      await AdminAuthService.signOut();
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      // Clear stored session
      AdminAuthService.clearUserSession();
      
      console.log('✅ Signout completed successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      // Even if signout fails, clear local state
      setUser(null);
      setSession(null);
      AdminAuthService.clearUserSession();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      setLoading(true);
      
      // TODO: Implement profile update via AdminAuthService
      console.log('Profile update requested:', updates);
      
      // For now, just update local state
      setUser({ ...user, ...updates });
      
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // TODO: Implement password reset via AdminAuthService
      console.log('Password reset requested for:', email);
      throw new Error('Password reset not implemented yet');
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      // TODO: Implement password update via AdminAuthService
      console.log('Password update requested');
      throw new Error('Password update not implemented yet');
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
