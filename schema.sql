-- ============================================================
-- VidAgent AI — Database Schema
-- Updated to match TypeScript types in src/lib/types/database.ts
-- ============================================================

-- Create custom types
CREATE TYPE project_status AS ENUM ('draft', 'generating', 'editing', 'rendering', 'complete', 'failed');
CREATE TYPE asset_type AS ENUM ('voice_audio', 'avatar_video', 'broll_clip', 'caption_json', 'music', 'sfx', 'final_video', 'thumbnail');

-- ============================================================
-- Users table (extends Supabase auth.users)
-- ============================================================
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

-- ============================================================
-- Voice profiles table
-- ============================================================
CREATE TABLE voice_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  provider TEXT NOT NULL,
  provider_voice_id TEXT,
  sample_url TEXT NOT NULL,
  preview_url TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- Avatar profiles table
-- ============================================================
CREATE TABLE avatar_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_type TEXT,
  original_asset_url TEXT NOT NULL,
  processed_asset_url TEXT,
  preview_image_url TEXT,
  status TEXT DEFAULT 'processing',
  is_default BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- Projects table
-- ============================================================
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  script_raw TEXT,
  script_optimized TEXT,
  hook_selected TEXT,
  platform TEXT NOT NULL,
  style_template TEXT NOT NULL,
  voice_profile_id UUID REFERENCES voice_profiles(id) ON DELETE SET NULL,
  avatar_profile_id UUID REFERENCES avatar_profiles(id) ON DELETE SET NULL,
  status project_status DEFAULT 'draft',
  render_progress INTEGER DEFAULT 0,
  timeline_json JSONB,
  final_video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds DOUBLE PRECISION,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- Project assets table
-- ============================================================
CREATE TABLE project_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  type asset_type NOT NULL,
  url TEXT NOT NULL,
  filename TEXT,
  duration_seconds DOUBLE PRECISION,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- Render jobs table (for tracking BullMQ job status)
-- ============================================================
CREATE TABLE render_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT DEFAULT 'queued',
  bullmq_job_id TEXT,
  progress INTEGER DEFAULT 0,
  result_url TEXT,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- Indexes for query performance
-- ============================================================
CREATE INDEX idx_voice_profiles_user_id ON voice_profiles(user_id);
CREATE INDEX idx_avatar_profiles_user_id ON avatar_profiles(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_assets_project_id ON project_assets(project_id);
CREATE INDEX idx_project_assets_type ON project_assets(type);
CREATE INDEX idx_render_jobs_project_id ON render_jobs(project_id);
CREATE INDEX idx_render_jobs_user_id ON render_jobs(user_id);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

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

-- Render Jobs
ALTER TABLE render_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own render jobs" ON render_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own render jobs" ON render_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Triggers
-- ============================================================

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
