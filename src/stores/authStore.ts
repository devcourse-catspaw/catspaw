import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import supabase from '../utils/supabase'

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    const { data } = await supabase.auth.getUser()
    set({ user: data.user })
  },
}))
