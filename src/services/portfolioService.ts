import { supabase, PortfolioData, PortfolioUpdate } from '../config/supabase';
import { authService } from './authService';
import { ApiError } from './types';

interface Portfolio {
  id: string;
  user_id: string;
  template_id?: string;
  title: string;
  description?: string;
  slug?: string;
  custom_domain?: string;
  visibility: 'public' | 'private' | 'unlisted';
  status: 'draft' | 'published' | 'archived';
  content: Record<string, unknown>;
  styles?: Record<string, unknown>;
  seo_settings?: Record<string, unknown>;
  analytics_settings?: Record<string, unknown>;
  custom_css?: string;
  custom_js?: string;
  favicon_url?: string;
  og_image_url?: string;
  view_count: number;
  last_published_at?: string;
  created_at: string;
  updated_at: string;
  projects?: Project[];
  skills?: Skill[];
  experiences?: Experience[];
  education?: Education[];
}

interface Project {
  id: string;
  portfolio_id: string;
  title: string;
  description?: string;
  project_url?: string;
  github_url?: string;
  demo_url?: string;
  image_urls: string[];
  technologies: string[];
  tags: string[];
  start_date?: string;
  end_date?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  sort_order: number;
  project_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface Skill {
  id: string;
  portfolio_id: string;
  name: string;
  category?: string;
  proficiency_level: number;
  years_experience?: number;
  description?: string;
  verified: boolean;
  endorsements_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Experience {
  id: string;
  portfolio_id: string;
  company_name: string;
  position: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location?: string;
  company_url?: string;
  company_logo_url?: string;
  achievements: string[];
  technologies: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Education {
  id: string;
  portfolio_id: string;
  institution_name: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  gpa?: number;
  description?: string;
  achievements: string[];
  location?: string;
  institution_url?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

class PortfolioService {
  // Get user's portfolios
  async getUserPortfolios(): Promise<{ data: Portfolio[] }> {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        throw new ApiError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          projects(*),
          skills(*),
          experiences(*),
          education(*)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new ApiError(error.message, 500, 'GET_PORTFOLIOS_ERROR');
      }

      return { data: data || [] };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch portfolios', 500, 'GET_PORTFOLIOS_ERROR');
    }
  }

  // Get portfolio by ID
  async getPortfolio(portfolioId: string): Promise<{ data: Portfolio }> {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          projects(*),
          skills(*),
          experiences(*),
          education(*)
        `)
        .eq('id', portfolioId)
        .single();

      if (error) {
        throw new ApiError(error.message, 500, 'GET_PORTFOLIO_ERROR');
      }

      if (!data) {
        throw new ApiError('Portfolio not found', 404, 'PORTFOLIO_NOT_FOUND');
      }

      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch portfolio', 500, 'GET_PORTFOLIO_ERROR');
    }
  }

  // Create new portfolio
  async createPortfolio(portfolioData: PortfolioData): Promise<{ data: Portfolio }> {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        throw new ApiError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const dataWithUserId = {
        ...portfolioData,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          ...portfolioData,
          user_id: user.id,
          status: 'draft',
          visibility: 'private',
          view_count: 0,
          content: portfolioData.content || {},
          styles: portfolioData.styles || {},
          seo_settings: portfolioData.seo_settings || {}
        })
        .select()
        .single();

      if (error) {
        throw new ApiError(error.message, 500, 'CREATE_PORTFOLIO_ERROR');
      }

      // Log activity
      await authService.logActivity(
        'portfolio_created',
        `Created new portfolio: ${portfolioData.title}`,
        { portfolio_id: data.id }
      );

      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create portfolio', 500, 'CREATE_PORTFOLIO_ERROR');
    }
  }

  // Update portfolio
  async updatePortfolio(portfolioId: string, updates: PortfolioUpdate): Promise<{ data: Portfolio }> {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', portfolioId)
        .select()
        .single();

      if (error) {
        throw new ApiError(error.message, 500, 'UPDATE_PORTFOLIO_ERROR');
      }

      // Log activity
      await authService.logActivity(
        'portfolio_updated',
        `Updated portfolio: ${data.title}`,
        { portfolio_id: portfolioId }
      );

      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update portfolio', 500, 'UPDATE_PORTFOLIO_ERROR');
    }
  }

  // Delete portfolio
  async deletePortfolio(portfolioId: string): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId);

      if (error) {
        throw new ApiError(error.message, 500, 'DELETE_PORTFOLIO_ERROR');
      }

      // Log activity
      await authService.logActivity(
        'portfolio_deleted',
        `Deleted portfolio`,
        { portfolio_id: portfolioId }
      );

      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to delete portfolio', 500, 'DELETE_PORTFOLIO_ERROR');
    }
  }

  // Get recent portfolios
  async getRecentPortfolios(limit = 5): Promise<{ data: Portfolio[] }> {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        throw new ApiError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new ApiError(error.message, 500, 'GET_RECENT_PORTFOLIOS_ERROR');
      }

      return { data: data || [] };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch recent portfolios', 500, 'GET_RECENT_PORTFOLIOS_ERROR');
    }
  }

  // Duplicate portfolio
  async duplicatePortfolio(portfolioId: string, newTitle: string): Promise<{ data: Portfolio }> {
    try {
      const { data: originalPortfolio } = await this.getPortfolio(portfolioId);

      const duplicateData: PortfolioData = {
        title: newTitle,
        description: originalPortfolio.description,
        template_id: originalPortfolio.template_id,
        visibility: 'private', // Always create duplicates as private
        content: originalPortfolio.content,
        styles: originalPortfolio.styles,
        seo_settings: originalPortfolio.seo_settings
      };

      return await this.createPortfolio(duplicateData);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to duplicate portfolio', 500, 'DUPLICATE_PORTFOLIO_ERROR');
    }
  }

  // Publish portfolio
  async publishPortfolio(portfolioId: string): Promise<{ data: Portfolio }> {
    try {
      const updates: PortfolioUpdate = {
        status: 'published',
        visibility: 'public'
      };

      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', portfolioId)
        .select()
        .single();

      if (error) {
        throw new ApiError(error.message, 500, 'PUBLISH_PORTFOLIO_ERROR');
      }

      // Log activity
      await authService.logActivity(
        'portfolio_published',
        `Published portfolio: ${data.title}`,
        { portfolio_id: portfolioId }
      );

      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to publish portfolio', 500, 'PUBLISH_PORTFOLIO_ERROR');
    }
  }

  // Unpublish portfolio
  async unpublishPortfolio(portfolioId: string): Promise<{ data: Portfolio }> {
    try {
      const updates: PortfolioUpdate = {
        status: 'draft',
        visibility: 'private'
      };

      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', portfolioId)
        .select()
        .single();

      if (error) {
        throw new ApiError(error.message, 500, 'UNPUBLISH_PORTFOLIO_ERROR');
      }

      // Log activity
      await authService.logActivity(
        'portfolio_unpublished',
        `Unpublished portfolio: ${data.title}`,
        { portfolio_id: portfolioId }
      );

      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to unpublish portfolio', 500, 'UNPUBLISH_PORTFOLIO_ERROR');
    }
  }
}

// Create and export singleton instance
export const portfolioService = new PortfolioService();
export default portfolioService;
