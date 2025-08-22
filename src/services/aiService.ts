import { apiService } from './apiService';
import { 
  AIGenerationRequest, 
  AIGenerationResponse, 
  AICustomizationRequest, 
  AIPortfolioRequest 
} from './types';

export interface UserData {
  name?: string;
  profession?: string;
  experience?: string;
  skills?: string[];
  education?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  bio?: string;
  objectives?: string;
  achievements?: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  workExperience?: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
}

export interface AIUsageStats {
  currentUsage: number;
  plan: 'free' | 'pro' | 'enterprise';
  limits: {
    free: number;
    pro: string;
    enterprise: string;
  };
  remainingGenerations: number | 'unlimited';
  canUseAI: boolean;
  resetDate?: string;
}

export interface ImprovementSuggestion {
  section: string;
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  reason: string;
}

export interface ImprovementAnalysis {
  overallScore: number;
  improvements: ImprovementSuggestion[];
  strengths: string[];
  seoSuggestions: string[];
  designSuggestions: string[];
}

class AIService {
  // Generate content for specific portfolio sections
  async generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    return apiService['post']<AIGenerationResponse>('/ai/generate-content', request);
  }

  // AI-powered template customization
  async customizeTemplate(request: AICustomizationRequest): Promise<{
    template: {
      id: string;
      name: string;
      category: string;
    };
    customizedContent: Record<string, unknown>;
    tokensUsed: number;
    remainingGenerations: number | 'unlimited';
  }> {
    return apiService['post']<{
      template: {
        id: string;
        name: string;
        category: string;
      };
      customizedContent: Record<string, unknown>;
      tokensUsed: number;
      remainingGenerations: number | 'unlimited';
    }>('/ai/customize-template', request);
  }

  // Generate complete portfolio using AI
  async generatePortfolio(request: AIPortfolioRequest): Promise<{
    portfolio: Record<string, unknown>;
    template?: {
      id: string;
      name: string;
      category: string;
    };
    tokensUsed: number;
    remainingGenerations: number | 'unlimited';
  }> {
    return apiService['post']<{
      portfolio: Record<string, unknown>;
      template?: {
        id: string;
        name: string;
        category: string;
      };
      tokensUsed: number;
      remainingGenerations: number | 'unlimited';
    }>('/ai/generate-portfolio', request);
  }

  // Get AI usage statistics
  async getUsageStats(): Promise<{ usage: AIUsageStats }> {
    return apiService['get']<{ usage: AIUsageStats }>('/ai/usage');
  }

  // Get improvement suggestions for portfolio
  async getSuggestions(portfolioContent: Record<string, unknown>): Promise<{
    suggestions: ImprovementAnalysis;
    tokensUsed: number;
  }> {
    return apiService['post']<{
      suggestions: ImprovementAnalysis;
      tokensUsed: number;
    }>('/ai/suggest-improvements', { portfolioContent });
  }

  // Helper method to generate content for About section
  async generateAboutSection(userData: UserData, additionalContext?: string): Promise<AIGenerationResponse> {
    return this.generateContent({
      section: 'about',
      userData,
      additionalContext,
    });
  }

  // Helper method to generate skills section
  async generateSkillsSection(userData: UserData, additionalContext?: string): Promise<AIGenerationResponse> {
    return this.generateContent({
      section: 'skills',
      userData,
      additionalContext,
    });
  }

  // Helper method to generate experience section
  async generateExperienceSection(userData: UserData, additionalContext?: string): Promise<AIGenerationResponse> {
    return this.generateContent({
      section: 'experience',
      userData,
      additionalContext,
    });
  }

  // Helper method to generate projects section
  async generateProjectsSection(userData: UserData, additionalContext?: string): Promise<AIGenerationResponse> {
    return this.generateContent({
      section: 'projects',
      userData,
      additionalContext,
    });
  }

  // Helper method to generate bio
  async generateBio(userData: UserData, additionalContext?: string): Promise<AIGenerationResponse> {
    return this.generateContent({
      section: 'bio',
      userData,
      additionalContext,
    });
  }

  // Check if user can use AI features
  async canUseAI(): Promise<boolean> {
    try {
      const stats = await this.getUsageStats();
      return stats.usage.canUseAI;
    } catch {
      return false;
    }
  }

  // Get remaining AI generations
  async getRemainingGenerations(): Promise<number | 'unlimited'> {
    try {
      const stats = await this.getUsageStats();
      return stats.usage.remainingGenerations;
    } catch {
      return 0;
    }
  }

  // Validate user data for AI generation
  validateUserData(userData: UserData): { isValid: boolean; missingFields: string[] } {
    const requiredFields = ['name', 'profession'];
    const missingFields: string[] = [];

    requiredFields.forEach(field => {
      if (!userData[field as keyof UserData]) {
        missingFields.push(field);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  // Format user data for AI prompts
  formatUserDataForAI(userData: UserData): Record<string, unknown> {
    return {
      personalInfo: {
        name: userData.name,
        profession: userData.profession,
        experience: userData.experience,
        location: userData.location,
        email: userData.email,
        phone: userData.phone,
        website: userData.website,
        bio: userData.bio,
      },
      professional: {
        skills: userData.skills || [],
        achievements: userData.achievements || [],
        objectives: userData.objectives,
        workExperience: userData.workExperience || [],
      },
      projects: userData.projects || [],
      education: userData.education,
      socialLinks: userData.socialLinks || {},
    };
  }
}

export const aiService = new AIService();
export default aiService;
