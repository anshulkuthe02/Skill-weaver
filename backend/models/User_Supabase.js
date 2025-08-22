const { supabase } = require('../config/supabase');

class User {
  static async create(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: userData.email,
          password_hash: userData.password_hash,
          first_name: userData.first_name,
          last_name: userData.last_name,
          username: userData.username,
          role: userData.role || 'user',
          preferences: userData.preferences || {},
          profile_data: userData.profile_data || {}
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  static async findByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Error finding user by username: ${error.message}`);
    }
  }

  static async updateById(id, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async updateLastLogin(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          last_login_at: new Date().toISOString(),
          login_count: supabase.rpc('increment_login_count', { user_id: id })
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error updating last login: ${error.message}`);
    }
  }

  static async deleteById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return { totalUsers: count };
    } catch (error) {
      throw new Error(`Error getting user stats: ${error.message}`);
    }
  }

  // Session management
  static async createSession(userId, sessionData) {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert([{
          user_id: userId,
          session_token: sessionData.session_token,
          refresh_token: sessionData.refresh_token,
          expires_at: sessionData.expires_at,
          ip_address: sessionData.ip_address,
          user_agent: sessionData.user_agent
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error creating session: ${error.message}`);
    }
  }

  static async findSessionByToken(sessionToken) {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*, users(*)')
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // Session not found
      }
      throw new Error(`Error finding session: ${error.message}`);
    }
  }

  static async invalidateSession(sessionToken) {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('session_token', sessionToken)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error invalidating session: ${error.message}`);
    }
  }

  static async invalidateAllUserSessions(userId) {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', userId)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error invalidating user sessions: ${error.message}`);
    }
  }

  // Activity logging
  static async logActivity(userId, activityData) {
    try {
      const { data, error } = await supabase
        .from('recent_activities')
        .insert([{
          user_id: userId,
          portfolio_id: activityData.portfolio_id,
          activity_type: activityData.activity_type,
          description: activityData.description,
          activity_data: activityData.activity_data || {}
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error logging activity: ${error.message}`);
    }
  }

  static async getRecentActivities(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('recent_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error getting recent activities: ${error.message}`);
    }
  }
}

module.exports = User;
