-- Create custom types
CREATE TYPE project_status AS ENUM ('draft', 'generating', 'editing', 'complete', 'failed');
CREATE TYPE asset_type AS ENUM ('avatar_video', 'voice_audio', 'broll_clip', 'caption_json', 'final_video');

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  render_credits INTEGER DEFAULT 5,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create voice profiles table
CREATE TABLE voice_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  provider TEXT NOT NULL,
  external_voice_id TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create avatar profiles table
CREATE TABLE avatar_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'processing',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  script TEXT NOT NULL,
  platform TEXT NOT NULL,
  style_template TEXT NOT NULL,
  voice_profile_id UUID REFERENCES voice_profiles(id) ON DELETE SET NULL,
  avatar_profile_id UUID REFERENCES avatar_profiles(id) ON DELETE SET NULL,
  status project_status DEFAULT 'draft',
  render_progress INTEGER DEFAULT 0,
  timeline_json JSONB,
  final_video_url TEXT,
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create project assets table
CREATE TABLE project_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  type asset_type NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Voice Profiles
ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own voice profiles" ON voice_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own voice profiles" ON voice_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own voice profiles" ON voice_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own voice profiles" ON voice_profiles FOR DELETE USING (auth.uid() = user_id);

-- Avatar Profiles
ALTER TABLE avatar_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own avatar profiles" ON avatar_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own avatar profiles" ON avatar_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own avatar profiles" ON avatar_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own avatar profiles" ON avatar_profiles FOR DELETE USING (auth.uid() = user_id);

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Project Assets
ALTER TABLE project_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own project assets" ON project_assets FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_assets.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can insert own project assets" ON project_assets FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_assets.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can update own project assets" ON project_assets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_assets.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can delete own project assets" ON project_assets FOR DELETE USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_assets.project_id AND projects.user_id = auth.uid())
);

-- Trigger to automatically create a user record when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
