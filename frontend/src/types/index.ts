export interface Message {
  id?: string;
  content: string;
  category: string;
  user_id: string;
  created_at?: string;
  status?: string;
  confidence?: number;
}

export interface SimilarCase {
  id: string;
  title: string;
  similarity: number;
}

export interface Step {
  id: string;
  content: string;
  completed?: boolean;
  codeSnippet?: string;
  estimatedTime?: string;
}

export interface Solution {
  title?: string;
  answer: string;
  steps: Step[];
  references: string[];
  confidence: number;
  similar_cases: SimilarCase[];
}

export interface MessageResponse {
  id: string;
  content: string;
  confidence: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  is_active: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  last_login: string | null;
}

export interface AdminRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface Metrics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalIssues: number;
    resolvedIssues: number;
    escalatedIssues: number;
    averageResolutionTime: number;
    userSatisfaction: number;
  };
  categories: Array<{
    id: string;
    name: string;
    issueCount: number;
    resolutionRate: number;
  }>;
  timeline: Array<{
    date: string;
    issues: number;
    resolutions: number;
    satisfaction: number;
  }>;
  performance: {
    responseTime: number;
    accuracy: number;
    aiConfidence: number;
    escalationRate: number;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  showSettings: boolean;
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface AdminMetrics {
  total_users: number;
  active_users: number;
  total_messages: number;
  resolved_messages: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  details: any;
}

export interface User {
  id: string;
  email: string;
  role: string;
}