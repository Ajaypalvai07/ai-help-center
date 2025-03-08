import * as Sentry from '@sentry/react';

export function initSentry() {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('Sentry DSN not found. Skipping Sentry initialization.');
    return;
  }

  try {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      enabled: import.meta.env.PROD,
      tracesSampleRate: 1.0,
    });
    console.log('✅ Sentry initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Sentry:', error);
  }
}