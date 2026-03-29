"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authDatasource } from "@/data/datasources";
import type { User } from "@/domain/entities";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await authDatasource.login(email, password);
          const user: User = { id: res.id, name: res.name, email: res.email, created_at: "", updated_at: "" };
          localStorage.setItem("auth_token", res.token);
          set({ user, token: res.token, isAuthenticated: true, loading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Login gagal";
          set({ error: message, loading: false });
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await authDatasource.register(name, email, password);
          const user: User = { id: res.id, name: res.name, email: res.email, created_at: "", updated_at: "" };
          localStorage.setItem("auth_token", res.token);
          set({ user, token: res.token, isAuthenticated: true, loading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Registrasi gagal";
          set({ error: message, loading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("auth_token");
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "bali-guide-auth",
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
