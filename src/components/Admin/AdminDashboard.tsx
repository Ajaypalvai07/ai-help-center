import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Users, MessageSquare, Activity, AlertTriangle, Clock, Award,
  TrendingUp, Database, Shield, Zap, Server, Globe, Coffee, CheckCircle, Info, RefreshCw
} from 'lucide-react';
import api from '../../lib/api';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';

interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalMessages: number;
  averageResponseTime: number;
  successRate: number;
  systemHealth: number;
  aiAccuracy: number;
}

interface ActivityLog {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  user?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const { user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const [metricsData, logsData] = await Promise.all([
        api.admin.getMetrics(),
        api.admin.getLogs()
      ]);
      setMetrics(metricsData as DashboardMetrics);
      setActivityLogs(logsData as ActivityLog[]);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      if (error?.status === 401 || error?.status === 403) {
        setError('Authentication error. Please check your permissions.');
      } else {
        setError(error?.message || 'Failed to fetch dashboard data');
      }
      // Keep existing data
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp className={`h-4 w-4 ${trend > 0 ? '' : 'transform rotate-180'}`} />
              <span className="ml-1 text-sm">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const stats = [
    { title: 'Total Users', value: metrics?.totalUsers || 0, icon: Users, color: 'bg-blue-500', trend: 12 },
    { title: 'Active Users', value: metrics?.activeUsers || 0, icon: Activity, color: 'bg-green-500', trend: 8 },
    { title: 'Messages', value: metrics?.totalMessages || 0, icon: MessageSquare, color: 'bg-purple-500', trend: 15 },
    { title: 'System Health', value: `${metrics?.systemHealth || 0}%`, icon: Server, color: 'bg-yellow-500', trend: 5 },
    { title: 'AI Accuracy', value: `${metrics?.aiAccuracy || 0}%`, icon: Zap, color: 'bg-indigo-500', trend: 3 },
    { title: 'Response Time', value: `${metrics?.averageResponseTime || 0}ms`, icon: Clock, color: 'bg-pink-500', trend: -2 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your AI Assistant platform
          </p>
        </div>
        <div className="flex space-x-4">
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setLoading(true);
              fetchDashboardData();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">User Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="active" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Response Time Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">AI Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aiPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#8884d8" />
              <Line type="monotone" dataKey="confidence" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Message Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activityLogs.slice(0, 5).map((log) => (
            <div 
              key={log.id} 
              className={`flex items-center p-4 rounded-lg ${
                log.type === 'error' ? 'bg-red-50 dark:bg-red-900/20' :
                log.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                log.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                'bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              {log.type === 'error' && <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />}
              {log.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />}
              {log.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mr-3" />}
              {log.type === 'info' && <Info className="h-5 w-5 text-blue-500 mr-3" />}
              <div className="flex-1">
                <p className="text-sm font-medium">{log.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(log.timestamp).toLocaleString()} {log.user && `• ${log.user}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SystemStatusCard
            title="API Health"
            status="healthy"
            metric="99.9%"
            icon={Globe}
          />
          <SystemStatusCard
            title="Database"
            status="healthy"
            metric="32ms"
            icon={Database}
          />
          <SystemStatusCard
            title="AI Model"
            status="healthy"
            metric="45ms"
            icon={Zap}
          />
          <SystemStatusCard
            title="Security"
            status="warning"
            metric="3 alerts"
            icon={Shield}
          />
        </div>
      </div>
    </div>
  );
}

const SystemStatusCard = ({ title, status, metric, icon: Icon }: any) => (
  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-gray-500" />
        <span className="font-medium">{title}</span>
      </div>
      <div className={`h-2 w-2 rounded-full ${
        status === 'healthy' ? 'bg-green-500' :
        status === 'warning' ? 'bg-yellow-500' :
        'bg-red-500'
      }`} />
    </div>
    <p className="text-2xl font-bold">{metric}</p>
  </div>
);

// Sample data for charts
const userActivityData = [
  { name: '00:00', active: 40 },
  { name: '04:00', active: 30 },
  { name: '08:00', active: 60 },
  { name: '12:00', active: 100 },
  { name: '16:00', active: 80 },
  { name: '20:00', active: 50 },
];

const responseTimeData = [
  { range: '0-100ms', count: 150 },
  { range: '100-200ms', count: 300 },
  { range: '200-300ms', count: 200 },
  { range: '300-400ms', count: 100 },
  { range: '400+ms', count: 50 },
];

const aiPerformanceData = [
  { time: '1h', accuracy: 95, confidence: 90 },
  { time: '2h', accuracy: 98, confidence: 92 },
  { time: '3h', accuracy: 96, confidence: 88 },
  { time: '4h', accuracy: 97, confidence: 91 },
  { time: '5h', accuracy: 99, confidence: 94 },
];

const categoryData = [
  { name: 'Technical', value: 400 },
  { name: 'Account', value: 300 },
  { name: 'Billing', value: 200 },
  { name: 'General', value: 278 },
  { name: 'Other', value: 189 },
]; 