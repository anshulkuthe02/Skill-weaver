const { supabase } = require('../config/supabase');

class Portfolio {
  static async create(portfolioData) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .insert([{
          user_id: portfolioData.user_id,
          template_id: portfolioData.template_id,
          title: portfolioData.title,
          description: portfolioData.description,
          slug: portfolioData.slug,
          visibility: portfolioData.visibility || 'private',
          status: portfolioData.status || 'draft',
          content: portfolioData.content || {},
          styles: portfolioData.styles || {},
          seo_settings: portfolioData.seo_settings || {},
          analytics_settings: portfolioData.analytics_settings || {}
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error creating portfolio: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          projects (*),
          skills (*),
          experiences (*),
          education (*),
          users (
            id,
            email,
            first_name,
            last_name,
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // Portfolio not found
      }
      throw new Error(`Error finding portfolio: ${error.message}`);
    }
  }

  static async findBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          projects (*),
          skills (*),
          experiences (*),
          education (*),
          users (
            id,
            first_name,
            last_name,
            username,
            avatar_url
          )
        `)
        .eq('slug', slug)
        .eq('visibility', 'public')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // Portfolio not found
      }
      throw new Error(`Error finding portfolio by slug: ${error.message}`);
    }
  }

  static async findByUserId(userId, filters = {}) {
    try {
      let query = supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.visibility) {
        query = query.eq('visibility', filters.visibility);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error finding user portfolios: ${error.message}`);
    }
  }

  static async updateById(id, updates) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error updating portfolio: ${error.message}`);
    }
  }

  static async deleteById(id) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error deleting portfolio: ${error.message}`);
    }
  }

  static async incrementViewCount(id) {
    try {
      const { data, error } = await supabase
        .rpc('increment_portfolio_views', { portfolio_id: id });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error incrementing view count: ${error.message}`);
    }
  }

  static async updatePublishedStatus(id, isPublished = true) {
    try {
      const updates = {
        status: isPublished ? 'published' : 'draft'
      };

      if (isPublished) {
        updates.last_published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error updating published status: ${error.message}`);
    }
  }

  static async getPublicPortfolios(filters = {}) {
    try {
      let query = supabase
        .from('portfolios')
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            username,
            avatar_url
          )
        `)
        .eq('visibility', 'public')
        .eq('status', 'published')
        .order('view_count', { ascending: false });

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error getting public portfolios: ${error.message}`);
    }
  }

  static async searchPortfolios(searchQuery, filters = {}) {
    try {
      let query = supabase
        .from('portfolios')
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            username,
            avatar_url
          )
        `)
        .eq('visibility', 'public')
        .eq('status', 'published')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order('view_count', { ascending: false });

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error searching portfolios: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      const { count, error } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return { totalPortfolios: count };
    } catch (error) {
      throw new Error(`Error getting portfolio stats: ${error.message}`);
    }
  }

  // Analytics methods
  static async logView(portfolioId, visitorData) {
    try {
      const { data, error } = await supabase
        .from('portfolio_analytics')
        .insert([{
          portfolio_id: portfolioId,
          visitor_id: visitorData.visitor_id,
          ip_address: visitorData.ip_address,
          user_agent: visitorData.user_agent,
          referrer: visitorData.referrer,
          page_path: visitorData.page_path,
          country_code: visitorData.country_code,
          city: visitorData.city,
          device_type: visitorData.device_type,
          browser: visitorData.browser
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error logging portfolio view: ${error.message}`);
    }
  }

  static async getAnalytics(portfolioId, timeRange = '30d') {
    try {
      let fromDate = new Date();
      
      switch (timeRange) {
        case '7d':
          fromDate.setDate(fromDate.getDate() - 7);
          break;
        case '30d':
          fromDate.setDate(fromDate.getDate() - 30);
          break;
        case '90d':
          fromDate.setDate(fromDate.getDate() - 90);
          break;
        default:
          fromDate.setDate(fromDate.getDate() - 30);
      }

      const { data, error } = await supabase
        .from('portfolio_analytics')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .gte('visited_at', fromDate.toISOString());

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error getting portfolio analytics: ${error.message}`);
    }
  }
}

module.exports = Portfolio;
