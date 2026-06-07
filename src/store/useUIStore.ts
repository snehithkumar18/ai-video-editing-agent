import { create } from 'zustand'

export interface Toast {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning'
}

interface UIState {
  sidebarOpen: boolean
  createProjectModalOpen: boolean
  activeToasts: Toast[]
  toggleSidebar: () => void
  openCreateModal: () => void
  closeCreateModal: () => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  createProjectModalOpen: false,
  activeToasts: [],

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  openCreateModal: () => set({ createProjectModalOpen: true }),
  
  closeCreateModal: () => set({ createProjectModalOpen: false }),
  
  addToast: (toast) => set((state) => ({
    activeToasts: [...state.activeToasts, { ...toast, id: Math.random().toString(36).substring(2, 9) }]
  })),
  
  removeToast: (id) => set((state) => ({
    activeToasts: state.activeToasts.filter((t) => t.id !== id)
  }))
}))
