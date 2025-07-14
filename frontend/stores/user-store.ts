import { Role } from '@/types/roles';
import { create } from 'zustand';

export type User = {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  perfil: string;
  created_at: Date | string;
  updated_at: Date | string;
};

type UserStore = {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => void;
  updateUser: (
    id: number,
    user: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
  ) => void;
  deleteUser: (id: number) => void;
  getUser: (id: number) => User | undefined;
};

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],

  setUsers: (users) => {
    const parsedUsers = users.map((user) => ({
      ...user,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    set({ users: parsedUsers });
  },

  addUser: (user) => {
    const newUser: User = {
      ...user,
      id: Date.now(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    set((state) => ({
      users: [...state.users, newUser],
    }));
  },

  updateUser: (id, updatedUser) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id
          ? {
              ...user,
              ...updatedUser,
              updated_at: new Date(),
            }
          : user
      ),
    }));
  },

  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    }));
  },

  getUser: (id) => {
    return get().users.find((user) => user.id === id);
  },
}));
