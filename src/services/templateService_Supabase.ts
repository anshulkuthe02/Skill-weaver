import { database, TemplateFilters } from '../config/supabase';
import { ApiError } from './types';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  preview_image_url?: string;
  thumbnail_url?: string;
  template_data: Record<string, unknown>;
  styles?: Record<string, unknown>;
  layout_config?: Record<string, unknown>;
  features: string[];
  tags: string[];
  is_featured: boolean;
  is_premium: boolean;
  download_count: number;
  rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

class TemplateServiceSupabase {
  // Get all templates with optional filters
  async getTemplates(filters: TemplateFilters = {}): Promise<{ data: Template[] }> {
    try {
      const { data, error } = await database.getTemplates(filters);

      if (error) {
        throw new ApiError(error.message, 500, 'GET_TEMPLATES_ERROR');
      }

      return { data: data || [] };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch templates', 500, 'GET_TEMPLATES_ERROR');
    }
  }

  // Get template by ID
  async getTemplate(templateId: string): Promise<{ data: Template }> {
    try {
      const { data, error } = await database.getTemplate(templateId);

      if (error) {
        throw new ApiError(error.message, 500, 'GET_TEMPLATE_ERROR');
      }

      if (!data) {
        throw new ApiError('Template not found', 404, 'TEMPLATE_NOT_FOUND');
      }

      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch template', 500, 'GET_TEMPLATE_ERROR');
    }
  }

  // Get featured templates
  async getFeaturedTemplates(limit = 5): Promise<{ data: Template[] }> {
    try {
      const { data, error } = await database.getTemplates({
        featured: true,
        limit
      });

      if (error) {
        throw new ApiError(error.message, 500, 'GET_FEATURED_TEMPLATES_ERROR');
      }

      return { data: data || [] };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch featured templates', 500, 'GET_FEATURED_TEMPLATES_ERROR');
    }
  }

  // Get templates by category
  async getTemplatesByCategory(category: string, limit = 10): Promise<{ data: Template[] }> {
    try {
      const { data, error } = await database.getTemplates({
        category,
        limit
      });

      if (error) {
        throw new ApiError(error.message, 500, 'GET_CATEGORY_TEMPLATES_ERROR');
      }

      return { data: data || [] };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch templates by category', 500, 'GET_CATEGORY_TEMPLATES_ERROR');
    }
  }

  // Search templates
  async searchTemplates(query: string, filters: TemplateFilters = {}): Promise<{ data: Template[] }> {
    try {
      // For now, we'll use a simple client-side search
      // In a real app, you'd implement server-side search
      const { data: allTemplates, error } = await database.getTemplates(filters);

      if (error) {
        throw new ApiError(error.message, 500, 'SEARCH_TEMPLATES_ERROR');
      }

      const searchResults = (allTemplates || []).filter(template =>
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.description.toLowerCase().includes(query.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      return { data: searchResults };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to search templates', 500, 'SEARCH_TEMPLATES_ERROR');
    }
  }

  // Track template usage (for analytics)
  async trackTemplateUsage(templateId: string): Promise<void> {
    try {
      // This would typically increment download count
      // For now, we'll just log it
      console.log(`Template ${templateId} used`);
    } catch (error) {
      console.error('Failed to track template usage:', error);
    }
  }

  // Get template categories
  async getCategories(): Promise<{ data: string[] }> {
    try {
      // For now, return static categories
      // In a real app, you'd fetch this from the database
      const categories = [
        'developer',
        'creative',
        'business',
        'academic',
        'student',
        'freelancer',
        'startup',
        'minimal'
      ];

      return { data: categories };
    } catch (error) {
      throw new ApiError('Failed to fetch categories', 500, 'GET_CATEGORIES_ERROR');
    }
  }
}

// Create and export singleton instance
export const templateServiceSupabase = new TemplateServiceSupabase();
export default templateServiceSupabase;
