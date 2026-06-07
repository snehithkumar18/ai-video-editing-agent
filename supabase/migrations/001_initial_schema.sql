create extension if not exists "uuid-ossp";

create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free','starter','pro','agency')),
  stripe_customer_id text,
  stripe_subscription_id text,
  render_credits integer default 5,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.voice_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  description text,
  provider text default 'kokoro' check (provider in ('kokoro','openvoice','fish_audio','elevenlabs')),
  provider_voice_id text,
  sample_url text not null,
  preview_url text,
  is_default boolean default false,
  created_at timestamptz default now()
);

create table public.avatar_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  file_type text check (file_type in ('image','video')),
  original_asset_url text not null,
  processed_asset_url text,
  preview_image_url text,
  status text default 'processing' check (status in ('processing','ready','failed')),
  is_default boolean default false,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  script_raw text,
  script_optimized text,
  hook_selected text,
  platform text default 'instagram_reels' check (platform in ('youtube_shorts','instagram_reels','tiktok','youtube','linkedin')),
  style_template text default 'split_screen' check (style_template in ('split_screen','video_call','podcast','news_anchor','reaction_cam')),
  voice_profile_id uuid references public.voice_profiles(id),
  avatar_profile_id uuid references public.avatar_profiles(id),
  status text default 'draft' check (status in ('draft','generating','editing','rendering','complete','failed')),
  timeline_json jsonb default '{}',
  final_video_url text,
  thumbnail_url text,
  duration_seconds float,
  render_progress integer default 0,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.project_assets (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  type text not null check (type in ('voice_audio','avatar_video','broll_clip','caption_json','music','sfx','final_video','thumbnail')),
  url text not null,
  filename text,
  duration_seconds float,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table public.render_jobs (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  job_type text not null,
  status text default 'queued' check (status in ('queued','running','done','failed')),
  bullmq_job_id text,
  progress integer default 0,
  result_url text,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.voice_profiles enable row level security;
alter table public.avatar_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_assets enable row level security;
alter table public.render_jobs enable row level security;

create policy "users_own" on public.users for all using (auth.uid() = id);
create policy "voice_own" on public.voice_profiles for all using (auth.uid() = user_id);
create policy "avatar_own" on public.avatar_profiles for all using (auth.uid() = user_id);
create policy "projects_own" on public.projects for all using (auth.uid() = user_id);
create policy "assets_own" on public.project_assets for all using (auth.uid() = (select user_id from public.projects where id = project_id));
create policy "jobs_own" on public.render_jobs for all using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
