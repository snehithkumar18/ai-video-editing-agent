-- Atomic credit deduction function
-- Prevents race conditions by using a single UPDATE ... WHERE guard.
-- Returns TRUE if credits were successfully deducted, FALSE otherwise.

CREATE OR REPLACE FUNCTION deduct_render_credits(p_user_id UUID, p_cost INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_affected INTEGER;
BEGIN
  UPDATE users
  SET render_credits = render_credits - p_cost
  WHERE id = p_user_id
    AND render_credits >= p_cost;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;

  RETURN rows_affected > 0;
END;
$$;


-- Automate user onboarding: give 100 free render credits and seed default profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- 1. Insert user with 100 free render credits
  INSERT INTO public.users (id, email, full_name, avatar_url, render_credits)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    100
  );

  -- 2. Automatically seed default voice profile for this user
  INSERT INTO public.voice_profiles (id, user_id, name, description, provider, sample_url, preview_url, is_default)
  VALUES (
    uuid_generate_v4(),
    new.id,
    'Default Male Speaker',
    'Calm American male speaker (Kokoro TTS)',
    'kokoro',
    'af_bella',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    true
  );

  -- 3. Automatically seed default avatar profile for this user
  INSERT INTO public.avatar_profiles (id, user_id, name, file_type, original_asset_url, processed_asset_url, preview_image_url, status, is_default)
  VALUES (
    uuid_generate_v4(),
    new.id,
    'Default Presenter',
    'video',
    'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smartphone-talking-to-camera-40156-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smartphone-talking-to-camera-40156-large.mp4',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'ready',
    true
  );

  RETURN new;
END;
$$;

