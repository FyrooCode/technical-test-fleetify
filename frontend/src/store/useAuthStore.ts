import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  setAuth: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => set({ user }),
      logout: () => {
        set({ user: null });
        import('js-cookie').then((Cookies) => Cookies.default.remove('token'));
      },
    }),
    { name: 'auth-storage' }
  )
);