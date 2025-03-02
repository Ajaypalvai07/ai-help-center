import { Category, Message } from '../types';
import axios, { AxiosInstance } from 'axios';

// API URL configuration
const BASE_URL = 'http://localhost:8000/api/v1';

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

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as unknown as {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data?: any, config?: any): Promise<T>;
  put<T>(url: string, data?: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
  interceptors: AxiosInstance['interceptors'];
};

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors and transform response
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || 'An error occurred';
    throw { message, status: error.response?.status };
  }
);

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || 'An error occurred');
  }
  return response.json();
};

interface AuthAPI {
  login: (credentials: { email: string; password: string }) => Promise<{ access_token: string; user: any }>;
  signup: (userData: { email: string; password: string; name: string }) => Promise<void>;
  verify: () => Promise<{ user: any }>;
}

export const auth = {
  login: async (formData: FormData) => {
    const response = await axios.post(`${BASE_URL}/auth/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  signup: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/register', data);
    return response;
  },

  verify: async () => {
    const response = await api.get('/auth/verify');
    return response;
  },
};

export const categories = {
  getAll: async (): Promise<Category[]> => {
    return api.get<Category[]>('/categories');
  },

  getById: async (id: string) => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response;
  },

  getStats: async (categoryId: string) => {
    const response = await axios.get(`${BASE_URL}/categories/${categoryId}/stats`);
    return response.data;
  }
};

export const chat = {
  analyze: async (data: { content: string; category: string; userId?: string }): Promise<ChatResponse> => {
    try {
      console.log('Sending chat analysis request:', data);
      const request: ChatAnalyzeRequest = {
        content: data.content,
        category: data.category,
        user_id: data.userId,
        timestamp: new Date().toISOString(),
        type: 'user'
      };
      
      // Our response interceptor transforms the response to data directly
      const response = await api.post<ChatResponse>('/chat/analyze', request);
      console.log('Received response:', response);
      
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from server');
      }
      
      const chatResponse = response as unknown as ChatResponse;
      if (!chatResponse.content || !chatResponse.created_at || !chatResponse.confidence) {
        throw new Error('Invalid response format from server');
      }
      
      return chatResponse;
    } catch (error) {
      console.error('Chat analysis error:', error);
      throw error;
    }
  },

  submitFeedback: async (messageId: string, feedback: any) => {
    const response = await axios.post(`${BASE_URL}/chat/${messageId}/feedback`, feedback);
    return response.data;
  },

  analyzeMessage: async (message: Message): Promise<ChatResponse> => {
    return api.post<ChatResponse>('/chat/analyze', message);
  },
};

export const admin = {
  getMetrics: async () => {
    const response = await api.get('/admin/metrics');
    return response;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response;
  },

  getRoles: async () => {
    const response = await api.get('/admin/roles');
    return response;
  },

  getLogs: async () => {
    const response = await api.get('/admin/logs');
    return response;
  },
};

export const feedback = {
  submit: async (data: FeedbackSubmission) => {
    return api.post('/feedback/submit', data);
  },
  
  getStats: async () => {
    return api.get('/feedback/stats');
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

export default {
  auth,
  categories,
  chat,
  admin,
  feedback,
  multimedia
};