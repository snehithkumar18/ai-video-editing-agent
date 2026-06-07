import { create } from 'zustand'
import type { AvatarProfile } from '@/lib/types'

interface AvatarState {
  avatarProfiles: AvatarProfile[]
  isLoading: boolean
  fetchAvatarProfiles: () => Promise<void>
  addAvatarProfile: (profile: AvatarProfile) => void
  deleteAvatarProfile: (id: string) => void
  setDefault: (id: string) => void
}

export const useAvatarStore = create<AvatarState>((set) => ({
  avatarProfiles: [],
  isLoading: false,

  fetchAvatarProfiles: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/avatar/list')
      const data = await res.json()
      if (data.success) {
        set({ avatarProfiles: data.data, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      set({ isLoading: false })
    }
  },

  addAvatarProfile: (profile) => {
    set((state) => ({ avatarProfiles: [...state.avatarProfiles, profile] }))
  },

  deleteAvatarProfile: (id) => {
    set((state) => ({
      avatarProfiles: state.avatarProfiles.filter((p) => p.id !== id)
    }))
  },

  setDefault: (id) => {
    set((state) => ({
      avatarProfiles: state.avatarProfiles.map((p) => ({
        ...p,
        is_default: p.id === id
      }))
    }))
  }
}))
