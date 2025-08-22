-- Profile Details Table Creation Script for Supabase
-- Run this in your Supabase SQL Editor

-- Create the Profile Details table
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
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Profile Details_user_id_idx" ON public."Profile Details"(user_id);
CREATE INDEX IF NOT EXISTS "Profile Details_email_idx" ON public."Profile Details"(email);
CREATE INDEX IF NOT EXISTS "Profile Details_created_at_idx" ON public."Profile Details"(created_at);

-- Add Row Level Security (RLS) policies
ALTER TABLE public."Profile Details" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile details" ON public."Profile Details"
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile details" ON public."Profile Details"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile details" ON public."Profile Details"
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete own profile details" ON public."Profile Details"
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_profile_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at when the table is modified
CREATE OR REPLACE TRIGGER update_profile_details_updated_at_trigger
  BEFORE UPDATE ON public."Profile Details"
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_details_updated_at();

-- Optional: Create unique constraint on user_id to ensure one profile per user
ALTER TABLE public."Profile Details" 
ADD CONSTRAINT "Profile Details_user_id_unique" UNIQUE (user_id);

-- Grant necessary permissions
GRANT ALL ON public."Profile Details" TO authenticated;
GRANT ALL ON public."Profile Details" TO service_role;

-- Comment on table
COMMENT ON TABLE public."Profile Details" IS 'User profile details including personal information, social links, and skills';

-- Comments on columns
COMMENT ON COLUMN public."Profile Details".id IS 'Unique identifier for the profile record';
COMMENT ON COLUMN public."Profile Details".user_id IS 'Reference to the authenticated user';
COMMENT ON COLUMN public."Profile Details".first_name IS 'User first name';
COMMENT ON COLUMN public."Profile Details".last_name IS 'User last name';
COMMENT ON COLUMN public."Profile Details".email IS 'User email address';
COMMENT ON COLUMN public."Profile Details".title IS 'Professional title or job role';
COMMENT ON COLUMN public."Profile Details".bio IS 'User biography or description';
COMMENT ON COLUMN public."Profile Details".location IS 'User location (city, state, country)';
COMMENT ON COLUMN public."Profile Details".phone IS 'User phone number';
COMMENT ON COLUMN public."Profile Details".website IS 'Personal or professional website URL';
COMMENT ON COLUMN public."Profile Details".github IS 'GitHub username';
COMMENT ON COLUMN public."Profile Details".linkedin IS 'LinkedIn username';
COMMENT ON COLUMN public."Profile Details".avatar_url IS 'URL to user avatar/profile picture';
COMMENT ON COLUMN public."Profile Details".skills IS 'Array of user skills and technologies';
COMMENT ON COLUMN public."Profile Details".created_at IS 'Timestamp when record was created';
COMMENT ON COLUMN public."Profile Details".updated_at IS 'Timestamp when record was last updated';

-- Example: Insert a sample profile (optional - remove in production)
-- INSERT INTO public."Profile Details" (
--   user_id,
--   first_name,
--   last_name,
--   email,
--   title,
--   bio,
--   location,
--   phone,
--   website,
--   github,
--   linkedin,
--   skills
-- ) VALUES (
--   'YOUR_USER_ID_HERE',
--   'John',
--   'Doe',
--   'john.doe@example.com',
--   'Full Stack Developer',
--   'Passionate developer with experience in modern web technologies',
--   'San Francisco, CA',
--   '+1 (555) 123-4567',
--   'https://johndoe.dev',
--   'johndoe',
--   'john-doe-dev',
--   ARRAY['React', 'Node.js', 'TypeScript', 'Python', 'AWS']
-- );

-- Success message
SELECT 'Profile Details table created successfully!' as message;
