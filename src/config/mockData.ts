// Mock data and functions for when Supabase is not configured

interface MockUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
  preferences?: Record<string, unknown>;
  profile_data?: Record<string, unknown>;
}

export const mockUser: MockUser = {
  id: 'mock-user-123',
  email: 'demo@example.com',
  first_name: 'Demo',
  last_name: 'User',
  username: 'demouser',
  role: 'user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const mockPortfolios = [
  {
    id: 'portfolio-1',
    user_id: 'mock-user-123',
    title: 'Demo Portfolio 1',
    description: 'A sample portfolio showcasing web development skills',
    status: 'published',
    visibility: 'public',
    view_count: 245,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-02-01T15:30:00Z'
  },
  {
    id: 'portfolio-2',
    user_id: 'mock-user-123',
    title: 'Creative Showcase',
    description: 'A collection of creative projects and designs',
    status: 'draft',
    visibility: 'private',
    view_count: 89,
    created_at: '2024-02-10T09:00:00Z',
    updated_at: '2024-02-15T12:00:00Z'
  },
  {
    id: 'portfolio-3',
    user_id: 'mock-user-123',
    title: 'Professional Profile',
    description: 'Professional portfolio for career opportunities',
    status: 'published',
    visibility: 'public',
    view_count: 156,
    created_at: '2024-01-30T14:00:00Z',
    updated_at: '2024-02-20T16:45:00Z'
  }
];

export const isSupabaseConfigured = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  return supabaseUrl && 
         supabaseKey && 
         supabaseUrl !== 'https://placeholder.supabase.co' &&
         supabaseKey !== 'placeholder-key' &&
         !supabaseUrl.includes('your-project') && 
         !supabaseKey.includes('your-anon-key');
};

// Mock auth functions
export const mockAuthService = {
  async signUp(email: string, password: string, userData: UserData) {
    console.log('🔄 Mock signup:', { email, userData });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return {
      data: {
        user: { ...mockUser, email },
        session: { access_token: 'mock-token' }
      },
      error: null
    };
  },

  async signIn(email: string, password: string) {
    console.log('🔄 Mock signin:', { email });
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      data: {
        user: { ...mockUser, email },
        session: { access_token: 'mock-token' }
      },
      error: null
    };
  },

  async signOut() {
    console.log('🔄 Mock signout');
    return { error: null };
  },

  async getUser() {
    return { user: mockUser, error: null };
  },

  async getSession() {
    return { 
      session: { 
        access_token: 'mock-token',
        user: mockUser
      }, 
      error: null 
    };
  },

  async updateUser(updates: Partial<MockUser>) {
    console.log('🔄 Mock user update:', updates);
    return {
      data: { user: { ...mockUser, ...updates } },
      error: null
    };
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock database functions
export const mockDatabase: any = {
  from(table: string) {
    return {
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: any) => ({
            limit: (count: number) => Promise.resolve({
              data: table === 'portfolios' ? mockPortfolios.slice(0, count) : [],
              error: null
            }),
            then: (callback: any) => callback({
              data: table === 'portfolios' ? mockPortfolios : [],
              error: null
            })
          }),
          then: (callback: any) => callback({
            data: table === 'portfolios' ? mockPortfolios : [],
            error: null
          })
        }),
        then: (callback: any) => callback({
          data: table === 'portfolios' ? mockPortfolios : [],
          error: null
        })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({
            data: { id: 'new-' + Date.now(), ...data },
            error: null
          })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => Promise.resolve({
              data: { id: value, ...data },
              error: null
            })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({
          error: null
        })
      })
    };
  }
};
/* eslint-enable @typescript-eslint/no-explicit-any */
