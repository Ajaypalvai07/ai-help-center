import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export default function SessionCheck() {
  const navigate = useNavigate();
  const { auth, signOut, updateLastActivity, initializeAuth } = useStore();

  const checkSession = useCallback(() => {
    const lastActivity = auth.lastActivity;
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        signOut();
        navigate('/', { replace: true });
      }
    }
  }, [signOut, navigate, auth.lastActivity]);

  const handleActivity = useCallback(() => {
    if (auth.isAuthenticated) {
      updateLastActivity();
    }
  }, [auth.isAuthenticated, updateLastActivity]);

  // Initialize auth state
  useEffect(() => {
    initializeAuth().catch(error => {
      console.error('Failed to initialize auth:', error);
      navigate('/', { replace: true });
    });
  }, [initializeAuth, navigate]);

  // Set up session checking
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    // Initial session check
    checkSession();

    // Set up interval for checking session
    const intervalId = setInterval(checkSession, 60000);

    // Set up event listeners for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(intervalId);
    };
  }, [auth.isAuthenticated, checkSession, handleActivity]);

  return null;
} 