import { create } from 'zustand'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  clearError: () => void
  isSignedIn: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  login: async (email: string, password: string) => {
    set({ loading: true, error: null })

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        set({ error: error.message, loading: false })
        throw new Error(error.message)
      }

      set({ user: data.user, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        loading: false,
      })
      throw error
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ loading: true, error: null })

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            display_name: name,
          },
        },
      })

      if (error) {
        set({ error: error.message, loading: false })
        throw new Error(error.message)
      }

      set({ loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        loading: false,
      })
      throw error
    }
  },

  logout: async () => {
    set({ loading: true, error: null })

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        set({ error: error.message, loading: false })
        throw new Error(error.message)
      }

      set({ user: null, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
        loading: false,
      })
      throw error
    }
  },

  initialize: async () => {
    set({ loading: true })

    try {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error && error.message !== 'Auth session missing!') {
        set({ error: error.message, loading: false })
        return
      }

      set({ user, loading: false })

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        set({ user: session?.user || null })
      })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to initialize auth',
        loading: false,
      })
    }
  },
  isSignedIn: async () => {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) {
      set({ user: null, error: "User session expired" })
      return false
    }
    return user !== null
  },
}))
