import { create } from 'zustand'
import { AIEditHistoryItem, TimelineOperation } from '@/lib/types/aiEdit'

interface AIEditState {
  isProcessing: boolean
  error: string | null
  history: AIEditHistoryItem[]
  pendingOperations: TimelineOperation[] | null
  pendingExplanation: string
  pendingConfidence: 'high' | 'medium' | 'low'
  pendingHumanSummary: string
  showConfirmation: boolean
  
  setIsProcessing: (v: boolean) => void
  setError: (e: string | null) => void
  setPendingOperations: (ops: TimelineOperation[], explanation: string, confidence: 'high' | 'medium' | 'low', humanSummary: string) => void
  clearPending: () => void
  addToHistory: (item: AIEditHistoryItem) => void
  markUndone: (id: string) => void
}

export const useAIEditStore = create<AIEditState>((set) => ({
  isProcessing: false,
  error: null,
  history: [],
  pendingOperations: null,
  pendingExplanation: '',
  pendingConfidence: 'high',
  pendingHumanSummary: '',
  showConfirmation: false,
  setIsProcessing: (v) => set({ isProcessing: v }),
  setError: (e) => set({ error: e }),
  setPendingOperations: (ops, explanation, confidence, humanSummary) => set({
    pendingOperations: ops,
    pendingExplanation: explanation,
    pendingConfidence: confidence,
    pendingHumanSummary: humanSummary,
    showConfirmation: true
  }),
  clearPending: () => set({
    pendingOperations: null,
    pendingExplanation: '',
    pendingConfidence: 'high',
    pendingHumanSummary: '',
    showConfirmation: false
  }),
  addToHistory: (item) => set(s => ({ history: [item, ...s.history].slice(0, 50) })),
  markUndone: (id) => set(s => ({ history: s.history.map(h => h.id === id ? { ...h, undone: true } : h) }))
}))
