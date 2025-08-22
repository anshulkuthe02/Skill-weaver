import { supabase } from '../config/supabase';
import { ApiError } from './types';

export interface ProfileDetails {
  id?: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  title?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  avatar_url?: string;
  skills?: string[];
  created_at?: string;
  updated_at?: string;
}

class ProfileService {
  // Get profile details for a user
  async getProfile(userId: string): Promise<ProfileDetails | null> {
    try {
      const { data, error } = await supabase
        .from('Profile Details')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, return null
          return null;
        }
        throw new ApiError(`Failed to fetch profile: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch profile', 500);
    }
  }

  // Create or update profile details
  async upsertProfile(profileData: ProfileDetails): Promise<ProfileDetails> {
    try {
      // Generate unique ID if not provided
      if (!profileData.id) {
        profileData.id = crypto.randomUUID();
      }

      const { data, error } = await supabase
        .from('Profile Details')
        .upsert({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new ApiError(`Failed to save profile: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to save profile', 500);
    }
  }

  // Create new profile
  async createProfile(profileData: Omit<ProfileDetails, 'id' | 'created_at' | 'updated_at'>): Promise<ProfileDetails> {
    try {
      const newProfile = {
        id: crypto.randomUUID(),
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('Profile Details')
        .insert(newProfile)
        .select()
        .single();

      if (error) {
        throw new ApiError(`Failed to create profile: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create profile', 500);
    }
  }

  // Update profile details
  async updateProfile(userId: string, updates: Partial<ProfileDetails>): Promise<ProfileDetails> {
    try {
      const { data, error } = await supabase
        .from('Profile Details')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new ApiError(`Failed to update profile: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update profile', 500);
    }
  }

  // Delete profile
  async deleteProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('Profile Details')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new ApiError(`Failed to delete profile: ${error.message}`, 500);
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete profile', 500);
    }
  }

  // Update avatar URL
  async updateAvatar(userId: string, avatarUrl: string): Promise<ProfileDetails> {
    try {
      const { data, error } = await supabase
        .from('Profile Details')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new ApiError(`Failed to update avatar: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update avatar', 500);
    }
  }

  // Add or update skills
  async updateSkills(userId: string, skills: string[]): Promise<ProfileDetails> {
    try {
      const { data, error } = await supabase
        .from('Profile Details')
        .update({
          skills: skills,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new ApiError(`Failed to update skills: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update skills', 500);
    }
  }

  // Get all profiles (admin function)
  async getAllProfiles(): Promise<ProfileDetails[]> {
    try {
      const { data, error } = await supabase
        .from('Profile Details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new ApiError(`Failed to fetch profiles: ${error.message}`, 500);
      }

      return data || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch profiles', 500);
    }
  }
}

export const profileService = new ProfileService();
export default profileService;
