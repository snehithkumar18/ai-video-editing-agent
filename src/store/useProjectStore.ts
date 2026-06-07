import { create } from 'zustand'
import type { Project } from '@/lib/types'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  createProject: (data: any) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  
  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (data.success) {
        set({ projects: data.data, isLoading: false })
      } else {
        set({ error: 'Failed to fetch projects', isLoading: false })
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  createProject: async (data) => {
    // API call handled in component, this just updates state
    set((state) => ({ projects: [data, ...state.projects] }))
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      currentProject: state.currentProject?.id === id ? { ...state.currentProject, ...updates } : state.currentProject
    }))
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject
    }))
  },

  setCurrentProject: (project) => {
    set({ currentProject: project })
  }
}))
