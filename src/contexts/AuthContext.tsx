import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { supabase } from '../config/supabase';

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

interface UserSignUpData {
  firstName?: string;
  lastName?: string;
  username?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: UserSignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        
        if (session?.user) {
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            console.error('Error getting user after auth change:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: UserSignUpData) => {
    try {
      setLoading(true);
      const { user: newUser, session: newSession } = await authService.signUp({
        email,
        password,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        username: userData?.username
      });
      
      setUser(newUser);
      setSession(newSession);
      
      // Log activity
      await authService.logActivity('user_registered', 'User registered successfully');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: signedInUser, session: newSession } = await authService.signIn({
        email,
        password
      });
      
      setUser(signedInUser);
      setSession(newSession);
      
      // Log activity
      await authService.logActivity('user_logged_in', 'User logged in successfully');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Log activity before signing out
      if (user) {
        await authService.logActivity('user_logged_out', 'User logged out');
      }
      
      await authService.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
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
      const updatedUser = await authService.updateUserProfile(user.id, updates);
      setUser(updatedUser);
      
      // Log activity
      await authService.logActivity('profile_updated', 'User profile updated');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      await authService.updatePassword(newPassword);
      
      // Log activity
      await authService.logActivity('password_updated', 'User password updated');
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
    updatePassword
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

export default AuthContext;
