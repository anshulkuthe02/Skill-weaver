const { supabase } = require('../config/supabase');

class Template {
  static async create(templateData) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([{
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          difficulty: templateData.difficulty || 'beginner',
          preview_image_url: templateData.preview_image_url,
          thumbnail_url: templateData.thumbnail_url,
          template_data: templateData.template_data,
          styles: templateData.styles || {},
          layout_config: templateData.layout_config || {},
          features: templateData.features || [],
          tags: templateData.tags || [],
          is_featured: templateData.is_featured || false,
          is_premium: templateData.is_premium || false,
          created_by: templateData.created_by
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error creating template: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            username
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // Template not found
      }
      throw new Error(`Error finding template: ${error.message}`);
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = supabase
        .from('templates')
        .select('*')
        .order('rating', { ascending: false });

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters.featured !== undefined) {
        query = query.eq('is_featured', filters.featured);
      }

      if (filters.premium !== undefined) {
        query = query.eq('is_premium', filters.premium);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error finding templates: ${error.message}`);
    }
  }

  static async findByCategory(category, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('category', category)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error finding templates by category: ${error.message}`);
    }
  }

  static async findFeatured(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error finding featured templates: ${error.message}`);
    }
  }

  static async findPopular(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('download_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error finding popular templates: ${error.message}`);
    }
  }

  static async updateById(id, updates) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error updating template: ${error.message}`);
    }
  }

  static async incrementDownloadCount(id) {
    try {
      const { data, error } = await supabase
        .rpc('increment_template_downloads', { template_id: id });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error incrementing download count: ${error.message}`);
    }
  }

  static async updateRating(id, newRating, currentRatingCount) {
    try {
      const { data, error } = await supabase
        .rpc('update_template_rating', {
          template_id: id,
          new_rating: newRating,
          current_rating_count: currentRatingCount
        });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error updating template rating: ${error.message}`);
    }
  }

  static async deleteById(id) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error deleting template: ${error.message}`);
    }
  }

  static async searchTemplates(searchQuery, filters = {}) {
    try {
      let query = supabase
        .from('templates')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
        .order('rating', { ascending: false });

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error searching templates: ${error.message}`);
    }
  }

  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('category')
        .group('category');

      if (error) throw error;
      return data.map(item => item.category);
    } catch (error) {
      throw new Error(`Error getting template categories: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      const { count, error } = await supabase
        .from('templates')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return { totalTemplates: count };
    } catch (error) {
      throw new Error(`Error getting template stats: ${error.message}`);
    }
  }

  static async getCategoryStats() {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('category')
        .then(response => {
          const categoryCounts = {};
          response.data.forEach(template => {
            categoryCounts[template.category] = (categoryCounts[template.category] || 0) + 1;
          });
          return { data: categoryCounts, error: response.error };
        });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error getting category stats: ${error.message}`);
    }
  }

  // Template usage tracking
  static async trackUsage(templateId, userId) {
    try {
      // Log template usage for analytics
      const { data, error } = await supabase
        .from('template_usage')
        .insert([{
          template_id: templateId,
          user_id: userId,
          used_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Increment download count
      await this.incrementDownloadCount(templateId);

      return data;
    } catch (error) {
      throw new Error(`Error tracking template usage: ${error.message}`);
    }
  }
}

module.exports = Template;
