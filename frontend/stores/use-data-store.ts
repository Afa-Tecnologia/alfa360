// stores/user-store.ts
import { Role } from '@/lib/auth/route-access';
import { create } from 'zustand';

export interface PublicUserData {
  name: string;
  email: string;
  role: Role;
}

interface UserStore {
  user: PublicUserData | null;
  setUser: (user: PublicUserData) => void;
  clearUser: () => void;
}

export const useUserDataStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
