export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  is_active?: boolean;
  created_at?: string;
  last_login?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Store {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signOut: () => void;
  initializeAuth: () => void;
} 