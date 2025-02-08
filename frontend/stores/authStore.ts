import { User } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Perfil {
  type: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  perfil: Perfil | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setPerfil: (perfil: Perfil | null) => void;
  deleteAuthStorage: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      perfil: null,
      isAuthenticated: false,

      setToken: (token) =>
        set((state) => ({
          ...state,
          token,
          isAuthenticated: !!token,
        })),

      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
          isAuthenticated: !!user,
        })),

      setPerfil: (perfil) =>
        set((state) => ({
          ...state,
          perfil,
        })),

      deleteAuthStorage: () =>
        set(() => ({
          token: null,
          user: null,
          perfil: null,
          isAuthenticated: false,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
