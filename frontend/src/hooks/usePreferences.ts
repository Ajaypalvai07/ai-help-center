import { useState, useCallback } from 'react';
import type { UserPreferences } from '../types';

const defaultPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  language: 'en',
  showSettings: false,
  notifications: true,
  autoRefresh: false,
  refreshInterval: 30000
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return {
    preferences,
    updatePreference
  };
}