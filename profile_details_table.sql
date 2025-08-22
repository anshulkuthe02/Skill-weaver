-- Profile Details table creation script for Supabase
-- This table stores detailed profile information for users after login

CREATE TABLE IF NOT EXISTS public."Profile Details" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  title TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  website TEXT,
  github TEXT,
  linkedin TEXT,
  avatar_url TEXT,
  skills TEXT[], -- Array of skill strings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint on user_id to ensure one profile per user
ALTER TABLE public."Profile Details" 
ADD CONSTRAINT unique_user_profile UNIQUE (user_id);

-- Enable Row Level Security
ALTER TABLE public."Profile Details" ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view own profile details" ON public."Profile Details"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile details" ON public."Profile Details"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile details" ON public."Profile Details"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile details" ON public."Profile Details"
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_details_user_id ON public."Profile Details"(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_details_email ON public."Profile Details"(email);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profile_details_updated_at 
    BEFORE UPDATE ON public."Profile Details"
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to authenticated users
GRANT ALL ON public."Profile Details" TO authenticated;
GRANT USAGE ON SEQUENCE "Profile Details_id_seq" TO authenticated;
