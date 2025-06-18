import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import supabase from "../utils/supabase";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    set({ isLoading: true });
    const { data } = await supabase.auth.getUser();
    set({ user: data.user, isLoading: false });
  },
}));
