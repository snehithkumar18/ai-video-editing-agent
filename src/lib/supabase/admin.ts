import { createClient as _createClient } from '@supabase/supabase-js'
import { createMockClient } from './mockClient'
import type { SupabaseClient } from '@supabase/supabase-js'

// Note: This client uses the service role key and bypasses RLS.
// ONLY import this in server-side administrative code.
export const supabaseAdmin: SupabaseClient = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? _createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  : (createMockClient(
      '00000000-0000-0000-0000-000000000000', // mock admin session user id
      () => {}
    ) as unknown as SupabaseClient);

/**
 * Returns the admin Supabase client (bypasses RLS).
 * This wrapper matches the createClient() convention used by queue processors.
 */
export function createClient() {
  return supabaseAdmin
}

export type { SupabaseClient }


