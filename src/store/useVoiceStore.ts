import { create } from 'zustand'
import type { VoiceProfile } from '@/lib/types'

interface VoiceState {
  voiceProfiles: VoiceProfile[]
  isLoading: boolean
  fetchVoiceProfiles: () => Promise<void>
  addVoiceProfile: (profile: VoiceProfile) => void
  deleteVoiceProfile: (id: string) => void
  setDefault: (id: string) => void
}

export const useVoiceStore = create<VoiceState>((set) => ({
  voiceProfiles: [],
  isLoading: false,

  fetchVoiceProfiles: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/voice/list')
      const data = await res.json()
      if (data.success) {
        set({ voiceProfiles: data.data, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      set({ isLoading: false })
    }
  },

  addVoiceProfile: (profile) => {
    set((state) => ({ voiceProfiles: [...state.voiceProfiles, profile] }))
  },

  deleteVoiceProfile: (id) => {
    set((state) => ({
      voiceProfiles: state.voiceProfiles.filter((p) => p.id !== id)
    }))
  },

  setDefault: (id) => {
    set((state) => ({
      voiceProfiles: state.voiceProfiles.map((p) => ({
        ...p,
        is_default: p.id === id
      }))
    }))
  }
}))
