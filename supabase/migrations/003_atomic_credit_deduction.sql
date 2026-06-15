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
