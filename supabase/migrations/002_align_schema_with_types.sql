-- ============================================================
-- Migration: Align schema with TypeScript types
-- Fixes schema mismatches between database.ts and the actual DB
-- ============================================================

-- 1. Update project_status enum to include 'rendering' status
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'rendering';

-- 2. Update asset_type enum to include all types used in code
ALTER TYPE asset_type ADD VALUE IF NOT EXISTS 'music';
ALTER TYPE asset_type ADD VALUE IF NOT EXISTS 'sfx';
ALTER TYPE asset_type ADD VALUE IF NOT EXISTS 'thumbnail';

-- ============================================================
-- 3. Projects table — add missing columns
-- ============================================================

-- Rename 'script' to 'script_raw' (the code uses script_raw everywhere)
ALTER TABLE projects RENAME COLUMN script TO script_raw;

-- Allow script_raw to be nullable (code sets it as optional)
ALTER TABLE projects ALTER COLUMN script_raw DROP NOT NULL;

-- Add new columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS script_optimized TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS hook_selected TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS duration_seconds DOUBLE PRECISION;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS error_message TEXT;

-- ============================================================
-- 4. Voice profiles table — rename columns to match code
-- ============================================================

-- Rename audio_url → sample_url
ALTER TABLE voice_profiles RENAME COLUMN audio_url TO sample_url;

-- Rename external_voice_id → provider_voice_id
ALTER TABLE voice_profiles RENAME COLUMN external_voice_id TO provider_voice_id;

-- Add missing columns
ALTER TABLE voice_profiles ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE voice_profiles ADD COLUMN IF NOT EXISTS preview_url TEXT;

-- ============================================================
-- 5. Avatar profiles table — restructure for code compatibility
-- ============================================================

-- Rename image_url → original_asset_url
ALTER TABLE avatar_profiles RENAME COLUMN image_url TO original_asset_url;

-- Rename thumbnail_url → preview_image_url
ALTER TABLE avatar_profiles RENAME COLUMN thumbnail_url TO preview_image_url;

-- Add missing columns
ALTER TABLE avatar_profiles ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE avatar_profiles ADD COLUMN IF NOT EXISTS processed_asset_url TEXT;
ALTER TABLE avatar_profiles ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- ============================================================
-- 6. Project assets table — add missing columns
-- ============================================================
ALTER TABLE project_assets ADD COLUMN IF NOT EXISTS filename TEXT;
ALTER TABLE project_assets ADD COLUMN IF NOT EXISTS duration_seconds DOUBLE PRECISION;

-- ============================================================
-- 7. Create render_jobs table (referenced in TypeScript types)
-- ============================================================
CREATE TABLE IF NOT EXISTS render_jobs (
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

-- RLS for render_jobs
ALTER TABLE render_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own render jobs" ON render_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own render jobs" ON render_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 8. Add indexes for query performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_voice_profiles_user_id ON voice_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_avatar_profiles_user_id ON avatar_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_assets_project_id ON project_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assets_type ON project_assets(type);
CREATE INDEX IF NOT EXISTS idx_render_jobs_project_id ON render_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_user_id ON render_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
