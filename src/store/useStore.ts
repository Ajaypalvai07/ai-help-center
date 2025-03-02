import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message, Solution, User } from '../types';

interface AppState {
  messages: Message[];
  currentSolution: Solution | null;
  user: (User & { isAdmin?: boolean }) | null;
  metrics: {
    resolvedIssues: number;
    escalatedIssues: number;
    averageResolutionTime: number;
  };
  addMessage: (message: Message) => void;
  setSolution: (solution: Solution | null) => void;
  updateMetrics: (metrics: Partial<AppState['metrics']>) => void;
  setUser: (user: (User & { isAdmin?: boolean }) | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      messages: [],
      currentSolution: null,
      user: null,
      metrics: {
        resolvedIssues: 0,
        escalatedIssues: 0,
        averageResolutionTime: 0,
      },
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setSolution: (solution) => set({ currentSolution: solution }),
      updateMetrics: (metrics) =>
        set((state) => ({
          metrics: { ...state.metrics, ...metrics },
        })),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'ai-help-center-storage',
    }
  )
);