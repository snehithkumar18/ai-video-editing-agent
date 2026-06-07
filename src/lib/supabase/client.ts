import { createBrowserClient } from '@supabase/ssr'
import { createMockClient } from './mockClient'

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return createMockClient(
      getCookie('mock-session'),
      (val) => {
        if (typeof document !== 'undefined') {
          if (val) {
            document.cookie = `mock-session=${encodeURIComponent(val)}; path=/; max-age=31536000`;
          } else {
            document.cookie = 'mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          }
        }
      }
    ) as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

