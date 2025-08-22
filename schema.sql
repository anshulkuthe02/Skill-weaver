-- SkillWeave Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'premium')),
  preferences JSONB DEFAULT '{}',
  profile_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  custom_domain TEXT UNIQUE,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'unlisted')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  content JSONB DEFAULT '{}',
  styles JSONB DEFAULT '{}',
  seo_settings JSONB DEFAULT '{}',
  analytics_settings JSONB DEFAULT '{}',
  custom_css TEXT,
  custom_js TEXT,
  favicon_url TEXT,
  og_image_url TEXT,
  view_count INTEGER DEFAULT 0,
  last_published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  project_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  project_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  years_of_experience NUMERIC(3,1),
  description TEXT,
  icon_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_url TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship', 'freelance')),
  description TEXT,
  company_logo_url TEXT,
  achievements TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  institution_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  gpa NUMERIC(3,2),
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  location TEXT,
  institution_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  preview_url TEXT,
  thumbnail_url TEXT,
  template_data JSONB DEFAULT '{}',
  styles JSONB DEFAULT '{}',
  components JSONB DEFAULT '{}',
  rating NUMERIC(3,2) DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  visitor_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File uploads table
CREATE TABLE IF NOT EXISTS public.file_uploads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  file_type TEXT CHECK (file_type IN ('image', 'document', 'video', 'audio', 'other')),
  is_public BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT,
  activity_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON public.portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_visibility ON public.portfolios(visibility);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON public.portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON public.projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_skills_portfolio_id ON public.skills(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_experiences_portfolio_id ON public.experiences(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_education_portfolio_id ON public.education(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_analytics_portfolio_id ON public.analytics(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON public.file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_featured ON public.templates(is_featured);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Portfolios policies
CREATE POLICY "Users can view own portfolios" ON public.portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public portfolios are viewable by everyone" ON public.portfolios
  FOR SELECT USING (visibility = 'public' AND status = 'published');

CREATE POLICY "Users can insert own portfolios" ON public.portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios" ON public.portfolios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios" ON public.portfolios
  FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can manage own portfolio projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = projects.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- Skills policies
CREATE POLICY "Users can manage own portfolio skills" ON public.skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = skills.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- Experiences policies
CREATE POLICY "Users can manage own portfolio experiences" ON public.experiences
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = experiences.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- Education policies
CREATE POLICY "Users can manage own portfolio education" ON public.education
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = education.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- File uploads policies
CREATE POLICY "Users can view own files" ON public.file_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload files" ON public.file_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files" ON public.file_uploads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files" ON public.file_uploads
  FOR DELETE USING (auth.uid() = user_id);

-- User activities policies
CREATE POLICY "Users can view own activities" ON public.user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics policies (more permissive for portfolio owners)
CREATE POLICY "Portfolio owners can view analytics" ON public.analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = analytics.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Analytics can be inserted for any portfolio" ON public.analytics
  FOR INSERT WITH CHECK (true);

-- Templates policies (public read, admin write)
CREATE POLICY "Templates are publicly viewable" ON public.templates
  FOR SELECT USING (true);

-- Functions

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'username'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update portfolio view count
CREATE OR REPLACE FUNCTION public.increment_portfolio_views(portfolio_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.portfolios 
  SET view_count = view_count + 1 
  WHERE id = portfolio_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample templates
INSERT INTO public.templates (name, description, category, is_featured, preview_url, thumbnail_url, rating, downloads, tags) VALUES
  ('Modern Portfolio', 'A clean and modern portfolio template perfect for developers and designers', 'professional', true, '/templates/modern/preview.png', '/templates/modern/thumb.png', 4.8, 1250, ARRAY['modern', 'clean', 'responsive']),
  ('Creative Showcase', 'An artistic template perfect for designers, photographers, and creative professionals', 'creative', true, '/templates/creative/preview.png', '/templates/creative/thumb.png', 4.6, 890, ARRAY['creative', 'artistic', 'visual']),
  ('Minimal Professional', 'A simple and elegant template focusing on content and readability', 'minimal', false, '/templates/minimal/preview.png', '/templates/minimal/thumb.png', 4.7, 654, ARRAY['minimal', 'simple', 'clean']),
  ('Developer Focus', 'A technical template highlighting coding projects and technical skills', 'developer', true, '/templates/developer/preview.png', '/templates/developer/thumb.png', 4.9, 1100, ARRAY['developer', 'technical', 'projects']),
  ('Business Executive', 'A professional template for business leaders and executives', 'business', false, '/templates/business/preview.png', '/templates/business/thumb.png', 4.5, 320, ARRAY['business', 'executive', 'professional'])
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Complete setup
SELECT 'SkillWeave database schema setup completed successfully!' as message;
