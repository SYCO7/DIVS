import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export type VerificationStep = 
  | 'welcome'
  | 'personal-info'
  | 'document-upload'
  | 'face-capture'
  | 'review'
  | 'complete'

export interface Identity {
  id?: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  documentType: string
  documentNumber: string
  documentUrl?: string
  selfieUrl?: string
  faceDescriptor?: number[]
  status?: string
  verificationScore?: number
  livenessScore?: number
  ocrConfidence?: number
  createdAt?: string
  verifiedAt?: string
  auditHash?: string
}

interface AppStore {
  // Auth
  user: { id: string; email: string } | null
  isAdmin: boolean
  setUser: (user: { id: string; email: string } | null) => void
  setIsAdmin: (v: boolean) => void

  // Verification flow
  currentStep: VerificationStep
  identity: Partial<Identity>
  setCurrentStep: (step: VerificationStep) => void
  updateIdentity: (data: Partial<Identity>) => void
  resetFlow: () => void

  // UI
  isLoading: boolean
  setIsLoading: (v: boolean) => void

  // Session check
  checkSession: () => Promise<void>
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  isAdmin: false,
  setUser: (user) => set({ user }),
  setIsAdmin: (v) => set({ isAdmin: v }),

  currentStep: 'welcome',
  identity: {},
  setCurrentStep: (step) => set({ currentStep: step }),
  updateIdentity: (data) => set((state) => ({ identity: { ...state.identity, ...data } })),
  resetFlow: () => set({ currentStep: 'welcome', identity: {} }),

  isLoading: false,
  setIsLoading: (v) => set({ isLoading: v }),

  checkSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      set({ user: { id: session.user.id, email: session.user.email! } })
      // Check if admin
      const { data } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', session.user.id)
        .single()
      if (data) set({ isAdmin: true })
    }
  }
}))
