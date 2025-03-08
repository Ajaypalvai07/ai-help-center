import { Category, Message } from '../types';
import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ChatResponse {
  id: string;
  content: string;
  confidence: number;
  created_at: string;
  user_message_id: string;
}

interface ChatAnalyzeRequest {
  content: string;
  category: string;
  user_id?: string;
  timestamp: string;
  type: string;
}

interface FeedbackSubmission {
  message_id: string;
  rating: number;
  feedback_type: string;
  comment?: string;
  improvement_suggestions?: string;
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || 'An error occurred');
  }
  return response.json();
};

const auth = {
  login: async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      formData.append('grant_type', 'password');

      const response = await api.post('/api/v1/auth/token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      
      if (!response.data || !response.data.access_token || !response.data.user) {
        throw new Error('Invalid server response');
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      
      return {
        access_token: response.data.access_token,
        user: response.data.user
      };
    } catch (error: any) {
      console.error('Login error:', error.response || error);
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message ||
                         'Login failed';
      throw new Error(errorMessage);
    }
  },
  
  verify: async () => {
    try {
      const response = await api.get('/api/v1/auth/verify');
      return { user: response.data };
    } catch (error: any) {
      console.error('Verify error:', error);
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      throw error;
    }
  },
  
  signup: async (userData: { email: string; password: string; name: string }) => {
    try {
      const response = await api.post('/api/v1/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response || error);
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message ||
                         error.message ||
                         'Registration failed';
      throw new Error(errorMessage);
    }
  }
};

const categories = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/api/v1/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  getOne: async (id: string): Promise<Category> => {
    try {
      const response = await api.get(`/api/v1/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }
};

const chat = {
  analyze: async (message: { content: string; category: string }) => {
    const response = await api.post('/api/v1/chat/analyze', message);
    return response.data;
  },
  
  getHistory: async (userId: string) => {
    const response = await api.get(`/api/v1/chat/history/${userId}`);
    return response.data;
  }
};

export const admin = {
  getMetrics: async () => {
    const response = await api.get('/api/v1/admin/metrics');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/api/v1/admin/users');
    return response.data;
  },

  getRoles: async () => {
    const response = await api.get('/api/v1/admin/roles');
    return response.data;
  },

  getLogs: async () => {
    const response = await api.get('/api/v1/admin/logs');
    return response.data;
  },
};

const feedback = {
  submit: async (data: any) => {
    return api.post('/api/v1/feedback/submit', data);
  },
  
  getStats: async () => {
    return api.get('/api/v1/feedback/stats');
  }
};

export const multimedia = {
  uploadVoice: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return api.post<any>('/media/voice', formData, config);
  },
  
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return api.post<any>('/media/image', formData, config);
  },
  
  getAnalysis: async (analysisId: string) => {
    return api.get(`/media/analysis/${analysisId}`);
  }
};

// Export all API functions
export {
  auth,
  categories,
  chat,
  feedback
};

// Export default api instance
export default api;