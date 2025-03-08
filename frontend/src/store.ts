import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from './types';
import { auth as authApi } from './lib/api';

// Separate interfaces for better type safety
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  lastActivity: number;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  category: string;
}

interface ChatState {
  categoryId: string | null;
  lastMessage: Message | null;
  messageCount: number;
  lastActivity: number;
}

interface Store {
  // Auth State
  auth: AuthState;
  chat: ChatState;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<{ user: User; access_token: string }>;
  signOut: () => void;
  updateLastActivity: () => void;
  initializeAuth: () => Promise<void>;
  
  // Chat State
  setChatState: (state: Partial<ChatState>) => void;
  clearChatState: () => void;
}

// Constants
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Auth State
      auth: {
        user: null,
        isAuthenticated: false,
        lastActivity: Date.now()
      },

      // Chat State
      chat: {
        categoryId: null,
        lastMessage: null,
        messageCount: 0,
        lastActivity: Date.now()
      },

      setUser: (user) => set((state) => ({
        auth: {
          ...state.auth,
          user,
          isAuthenticated: !!user,
          lastActivity: Date.now()
        }
      })),

      login: async (email: string, password: string) => {
        try {
          // Clear any existing auth data first
          localStorage.removeItem('token');
          sessionStorage.removeItem('user');
          
          const response = await authApi.login(email, password);
          
          if (!response.access_token || !response.user) {
            throw new Error('Invalid server response');
          }

          // Store auth data
          localStorage.setItem('token', response.access_token);
          sessionStorage.setItem('user', JSON.stringify(response.user));
          
          // Update state
          set((state) => ({
            auth: {
              ...state.auth,
              user: response.user,
              isAuthenticated: true,
              lastActivity: Date.now()
            }
          }));

          return response;
        } catch (error: any) {
          // Clear any partial auth data
          localStorage.removeItem('token');
          sessionStorage.removeItem('user');
          set((state) => ({
            auth: {
              ...state.auth,
              user: null,
              isAuthenticated: false,
              lastActivity: Date.now()
            }
          }));
          
          console.error('Login failed:', error);
          throw error;
        }
      },

      signOut: () => {
        localStorage.removeItem('token');
        sessionStorage.clear();
        set((state) => ({
          auth: {
            user: null,
            isAuthenticated: false,
            lastActivity: Date.now()
          }
        }));
        get().clearChatState();
      },

      initializeAuth: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            get().signOut();
            return;
          }

          const response = await authApi.verify();
          if (!response.user) {
            throw new Error('Invalid server response');
          }

          set((state) => ({
            auth: {
              ...state.auth,
              user: response.user,
              isAuthenticated: true,
              lastActivity: Date.now()
            }
          }));
        } catch (error) {
          console.error('Auth initialization error:', error);
          get().signOut();
        }
      },

      updateLastActivity: () => set((state) => ({
        auth: {
          ...state.auth,
          lastActivity: Date.now()
        }
      })),

      setChatState: (newState) => set((state) => ({
        chat: {
          ...state.chat,
          ...newState,
          lastActivity: Date.now()
        }
      })),

      clearChatState: () => set((state) => ({
        chat: {
          categoryId: null,
          lastMessage: null,
          messageCount: 0,
          lastActivity: Date.now()
        }
      }))
    }),
    {
      name: 'ai-help-center-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist auth state in localStorage
        auth: {
          user: state.auth.user,
          isAuthenticated: state.auth.isAuthenticated,
          lastActivity: state.auth.lastActivity
        }
        // Don't persist chat state
      })
    }
  )
);

// Session activity checker
export const checkSession = () => {
  const store = useStore.getState();
  const lastActivity = store.auth.lastActivity;
  
  if (Date.now() - lastActivity > SESSION_TIMEOUT) {
    store.signOut();
    return false;
  }
  
  store.updateLastActivity();
  return true;
};