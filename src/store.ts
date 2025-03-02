import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from './types';

interface Store {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signOut: () => void;
  initializeAuth: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      signOut: () => {
        // Clear store state
        set({ user: null, isAuthenticated: false });
        
        // Clear storage
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('lastActivity');
        
        // Clear any other stored data
        localStorage.removeItem('persist:auth-storage');
      },
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        const userData = sessionStorage.getItem('user');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            set({ user, isAuthenticated: true });
          } catch (error) {
            console.error('Failed to parse user data:', error);
            set({ user: null, isAuthenticated: false });
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
); 