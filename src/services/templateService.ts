import { apiService } from './apiService';
import { Template, PaginatedResponse } from './types';

export interface TemplateFilters {
  category?: string;
  subcategory?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isPremium?: boolean;
  tags?: string;
  search?: string;
  sort?: 'popular' | 'rating' | 'newest' | 'oldest' | 'name';
  page?: number;
  limit?: number;
}

class TemplateService {
  // Get all templates with filtering
  async getTemplates(filters: TemplateFilters = {}): Promise<PaginatedResponse<Template>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/templates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService['get']<PaginatedResponse<Template>>(endpoint);
  }

  // Get template by ID
  async getTemplate(id: string): Promise<{ template: Template; requiresPremium?: boolean }> {
    return apiService['get']<{ template: Template; requiresPremium?: boolean }>(`/templates/${id}`);
  }

  // Get featured templates
  async getFeaturedTemplates(): Promise<{ templates: Template[] }> {
    return apiService['get']<{ templates: Template[] }>('/templates/featured');
  }

  // Get popular templates
  async getPopularTemplates(limit = 10): Promise<{ templates: Template[] }> {
    return apiService['get']<{ templates: Template[] }>(`/templates/popular?limit=${limit}`);
  }

  // Get template categories
  async getCategories(): Promise<{ categories: Array<{ _id: string; count: number; subcategories: string[] }> }> {
    return apiService['get']<{ categories: Array<{ _id: string; count: number; subcategories: string[] }> }>('/templates/categories');
  }

  // Get template by slug (for preview)
  async getTemplateBySlug(slug: string): Promise<{ template: Partial<Template> }> {
    return apiService['get']<{ template: Partial<Template> }>(`/templates/${slug}/preview`);
  }

  // Download/use template (requires authentication)
  async downloadTemplate(id: string): Promise<{ template: Partial<Template> }> {
    return apiService['post']<{ template: Partial<Template> }>(`/templates/${id}/download`);
  }

  // Rate template (requires authentication)
  async rateTemplate(id: string, rating: number): Promise<{ newRating: string; ratingCount: number }> {
    return apiService['post']<{ newRating: string; ratingCount: number }>(`/templates/${id}/rate`, { rating });
  }

  // Search templates
  async searchTemplates(query: string, filters: Omit<TemplateFilters, 'search'> = {}): Promise<PaginatedResponse<Template>> {
    return this.getTemplates({ ...filters, search: query });
  }

  // Get templates by category
  async getTemplatesByCategory(category: string, options: Omit<TemplateFilters, 'category'> = {}): Promise<PaginatedResponse<Template>> {
    return this.getTemplates({ ...options, category });
  }

  // Check if user can access template
  async checkTemplateAccess(templateId: string): Promise<{ hasAccess: boolean; reason?: string }> {
    try {
      await this.getTemplate(templateId);
      return { hasAccess: true };
    } catch (error: unknown) {
      if (error instanceof Error && 'status' in error && error.status === 403) {
        return { hasAccess: false, reason: 'Premium subscription required' };
      }
      throw error;
    }
  }
}

export const templateService = new TemplateService();
export default templateService;
