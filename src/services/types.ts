// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any[];
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  data: {
    [key: string]: T[];
    pagination: PaginationMeta;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    bio?: string;
    avatar?: string;
    location?: string;
    website?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      instagram?: string;
      behance?: string;
      dribbble?: string;
    };
  };
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
  };
  usage: {
    aiGenerations: number;
    portfoliosCreated: number;
  };
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Template Types
export interface Template {
  _id: string;
  name: string;
  slug: string;
  category: 'developer' | 'creative' | 'professional' | 'business' | 'student' | 'freelancer';
  subcategory?: string;
  description: string;
  longDescription?: string;
  preview: {
    thumbnail: string;
    images: Array<{
      url: string;
      alt: string;
      caption?: string;
    }>;
    demoUrl?: string;
  };
  features: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
  technologies: Array<{
    name: string;
    category: 'frontend' | 'backend' | 'database' | 'deployment' | 'design';
  }>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: {
    setup: number;
    customization: number;
  };
  statistics: {
    views: number;
    downloads: number;
    likes: number;
    rating: {
      average: number;
      count: number;
    };
  };
  tags: string[];
  isPremium: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Portfolio Types
export interface Portfolio {
  _id: string;
  title: string;
  slug: string;
  userId: string;
  templateId: string;
  status: 'draft' | 'published' | 'archived';
  content: {
    personalInfo: {
      fullName?: string;
      title?: string;
      bio?: string;
      email?: string;
      phone?: string;
      location?: string;
      website?: string;
      avatar?: string;
      socialLinks?: Record<string, string>;
    };
    sections: Array<{
      id: string;
      type: string;
      title: string;
      content: any;
      order: number;
      isVisible: boolean;
    }>;
    skills?: Array<{
      name: string;
      category: string;
      level: number;
      years?: number;
      description?: string;
    }>;
    experience?: Array<{
      company: string;
      position: string;
      location?: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      description?: string;
      achievements?: string[];
      technologies?: string[];
    }>;
    projects?: Array<{
      title: string;
      description: string;
      longDescription?: string;
      technologies: string[];
      category?: string;
      images?: Array<{
        url: string;
        alt: string;
        caption?: string;
      }>;
      links?: {
        demo?: string;
        github?: string;
        website?: string;
      };
      startDate?: string;
      endDate?: string;
      status: 'completed' | 'in-progress' | 'planned';
      featured: boolean;
    }>;
  };
  design: {
    theme: {
      name?: string;
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
      backgroundColor?: string;
      textColor?: string;
    };
    typography: {
      headingFont?: string;
      bodyFont?: string;
      fontSize?: string;
    };
    layout: {
      style?: string;
      sidebar?: boolean;
      animations?: boolean;
    };
    customCSS?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
  analytics: {
    views: number;
    uniqueVisitors: number;
    lastViewed?: string;
  };
  privacy: {
    isPublic: boolean;
    passwordProtected: boolean;
    allowDownload: boolean;
    showInDirectory: boolean;
  };
  domain: {
    subdomain?: string;
    customDomain?: string;
    isCustomDomainActive: boolean;
  };
  publishedAt?: string;
  lastModified: string;
  createdAt: string;
  updatedAt: string;
}

// AI Types
export interface AIGenerationRequest {
  section: 'about' | 'skills' | 'experience' | 'projects' | 'bio';
  userData: Record<string, any>;
  additionalContext?: string;
}

export interface AIGenerationResponse {
  section: string;
  content: string;
  tokensUsed: number;
  remainingGenerations: number | 'unlimited';
}

export interface AICustomizationRequest {
  templateId: string;
  userData: Record<string, any>;
  customizationPreferences?: Record<string, any>;
}

export interface AIPortfolioRequest {
  userData: Record<string, any>;
  templateId?: string;
  preferences?: Record<string, any>;
}

// API Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'skillweave_access_token',
  REFRESH_TOKEN: 'skillweave_refresh_token',
  USER_DATA: 'skillweave_user_data',
  THEME: 'skillweave_theme',
} as const;
