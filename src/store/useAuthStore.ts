import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  user: any | null
  isLoading: boolean
  error: string | null
  setUser: (user: any | null) => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        set({ user: { ...user, ...profile }, isLoading: false })
      } else {
        set({ user: null, isLoading: false })
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  }
}))
