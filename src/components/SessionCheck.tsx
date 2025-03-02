import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export default function SessionCheck() {
  const navigate = useNavigate();
  const { user, signOut, initializeAuth } = useStore();

  const checkSession = useCallback(() => {
    const lastActivity = sessionStorage.getItem('lastActivity');
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        signOut();
        navigate('/auth/login');
      }
    }
  }, [signOut, navigate]);

  const updateLastActivity = useCallback(() => {
    if (user) {
      sessionStorage.setItem('lastActivity', Date.now().toString());
    }
  }, [user]);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Set up session checking
  useEffect(() => {
    if (!user) return;

    // Initial session check
    checkSession();

    // Set up interval for checking session
    const intervalId = setInterval(checkSession, 60000);

    // Set up event listeners for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(intervalId);
    };
  }, [user, checkSession, updateLastActivity]);

  return null;
} 