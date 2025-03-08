export const config = {
  mongoUri: import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017',
  dbName: import.meta.env.VITE_DB_NAME || 'ai_help_center',
  jwtSecret: import.meta.env.VITE_JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '24h',
  apiUrl: (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1',
  huggingFaceApiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY,
  huggingFaceModel: import.meta.env.VITE_HUGGINGFACE_MODEL || 'google/flan-t5-base',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
};

// Debug environment variables
console.log('Environment Variables Status:');
console.log('----------------------------');
console.log('MongoDB URI:', import.meta.env.VITE_MONGODB_URI ? '✓ Set' : '✗ Not set');
console.log('Database Name:', import.meta.env.VITE_DB_NAME ? '✓ Set' : '✗ Not set');
console.log('JWT Secret:', import.meta.env.VITE_JWT_SECRET ? '✓ Set' : '✗ Not set');
console.log('API URL:', import.meta.env.VITE_API_URL ? '✓ Set' : '✗ Not set');
console.log('Hugging Face API Key:', import.meta.env.VITE_HUGGINGFACE_API_KEY ? '✓ Set' : '✗ Not set');
console.log('Hugging Face Model:', import.meta.env.VITE_HUGGINGFACE_MODEL || 'Using default: google/flan-t5-base');
console.log('----------------------------');