import { createClient, Session, User } from '@supabase/supabase-js';
import { mockAuthService, mockDatabase, isSupabaseConfigured } from './mockData';

// Types
export interface UserData {
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
  preferences?: Record<string, unknown>;
  profile_data?: Record<string, unknown>;
}

export interface PortfolioData {
  title: string;
  description?: string;
  template_id?: string;
  visibility?: 'public' | 'private' | 'unlisted';
  content?: Record<string, unknown>;
  styles?: Record<string, unknown>;
  seo_settings?: Record<string, unknown>;
}

export interface PortfolioUpdate {
  title?: string;
  description?: string;
  visibility?: 'public' | 'private' | 'unlisted';
  status?: 'draft' | 'published' | 'archived';
  content?: Record<string, unknown>;
  styles?: Record<string, unknown>;
  seo_settings?: Record<string, unknown>;
  custom_css?: string;
  custom_js?: string;
}

export interface TemplateFilters {
  category?: string;
  featured?: boolean;
  limit?: number;
}

export type AuthEventType = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'PASSWORD_RECOVERY';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

const isConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && 
                    supabaseAnonKey !== 'placeholder-key' && 
                    !supabaseUrl.includes('your-project') &&
                    !supabaseAnonKey.includes('your-anon-key');

// Log configuration status
if (isConfigured) {
  console.log('✅ Supabase fully configured and ready');
} else {
  console.warn('⚠️ Supabase configuration incomplete');
  if (supabaseUrl.includes('lgddiqnuapkrowxekxxx')) {
    console.warn('✅ Supabase URL detected: ' + supabaseUrl);
    console.warn('⚠️ Please add your VITE_SUPABASE_ANON_KEY to complete setup');
  } else {
    console.warn('Please update your .env file with actual Supabase credentials');
  }
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData?: UserData) => {
    if (!isSupabaseConfigured()) {
      return mockAuthService.signUp(email, password, userData || {});
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return mockAuthService.signIn(email, password);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    if (!isSupabaseConfigured()) {
      return mockAuthService.signOut();
    }
    
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getUser: async () => {
    if (!isSupabaseConfigured()) {
      return mockAuthService.getUser();
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getSession: async () => {
    if (!isSupabaseConfigured()) {
      return mockAuthService.getSession();
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    if (!isSupabaseConfigured()) {
      console.log('🔄 Mock password reset for:', email);
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  },

  // Update password
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    return { data, error };
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: AuthEventType, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers - these are deprecated, use supabase client directly
const legacyDatabase = {
  // Get user's portfolios
  getUserPortfolios: async (userId: string) => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    return { data, error };
  },

  // Get portfolio by ID
  getPortfolio: async (portfolioId: string) => {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        projects (*),
        skills (*),
        experiences (*),
        education (*)
      `)
      .eq('id', portfolioId)
      .single();
    
    return { data, error };
  },

  // Create new portfolio
  createPortfolio: async (portfolioData: PortfolioData) => {
    const { data, error } = await supabase
      .from('portfolios')
      .insert(portfolioData)
      .select()
      .single();
    
    return { data, error };
  },

  // Update portfolio
  updatePortfolio: async (portfolioId: string, updates: PortfolioUpdate) => {
    const { data, error } = await supabase
      .from('portfolios')
      .update(updates)
      .eq('id', portfolioId)
      .select()
      .single();
    
    return { data, error };
  },

  // Delete portfolio
  deletePortfolio: async (portfolioId: string) => {
    const { data, error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioId);
    
    return { data, error };
  },

  // Get user's recent activities
  getRecentActivities: async (userId: string, limit = 10) => {
    const { data, error } = await supabase
      .from('recent_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  // Get templates
  getTemplates: async (filters?: TemplateFilters) => {
    let query = supabase
      .from('templates')
      .select('*')
      .order('rating', { ascending: false });

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.featured) {
      query = query.eq('is_featured', true);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get template by ID
  getTemplate: async (templateId: string) => {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    return { data, error };
  }
};

// Storage helpers
export const storage = {
  // Upload file
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    return { data, error };
  },

  // Get file URL
  getFileUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  // Delete file
  deleteFile: async (bucket: string, path: string) => {
    if (!isSupabaseConfigured()) {
      console.log('🔄 Mock file deletion:', { bucket, path });
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    return { data, error };
  }
};

// Export the main supabase client, but use mock database for queries when not configured
export const database = isSupabaseConfigured() ? supabase : mockDatabase;

export default supabase;
