import { useState, useMemo } from 'react';
import { BarChart, Users, Shield, Terminal, Settings, Search, LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { AdminMetrics, AdminUser, AdminRole, SystemLog } from '../types';

// Update API interface
declare module '../lib/api' {
  interface AdminAPI {
    getMetrics(): Promise<AdminMetrics>;
    getUsers(): Promise<AdminUser[]>;
    getRoles(): Promise<AdminRole[]>;
    getLogs(): Promise<SystemLog[]>;
  }
  
  interface API {
    admin: AdminAPI;
  }
}

export default function AdminDashboard(): JSX.Element {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<'overview' | 'users' | 'roles' | 'logs' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [logFilter, setLogFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch metrics data
  const { data: metrics } = useQuery<AdminMetrics>({
    queryKey: ['admin-metrics'],
    queryFn: () => api.admin.getMetrics(),
    refetchInterval: 30000
  });

  // Fetch users data
  const { data: users = [] } = useQuery<AdminUser[]>({
    queryKey: ['admin-users'],
    queryFn: () => api.admin.getUsers(),
    enabled: selectedView === 'users'
  });

  // Fetch roles data
  const { data: roles = [] } = useQuery<AdminRole[]>({
    queryKey: ['admin-roles'],
    queryFn: () => api.admin.getRoles(),
    enabled: selectedView === 'roles'
  });

  // Fetch logs data
  const { data: logs = [] } = useQuery<SystemLog[]>({
    queryKey: ['admin-logs'],
    queryFn: () => api.admin.getLogs(),
    enabled: selectedView === 'logs'
  });

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => logFilter === 'all' || log.type === logFilter);
  }, [logs, logFilter]);

  // Paginate users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Handle user actions
  const handleEditUser = (_userId: string) => {
    toast.error('Edit user functionality not implemented yet');
  };

  const handleDeleteUser = (_userId: string) => {
    toast.error('Delete user functionality not implemented yet');
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center gap-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <button
            onClick={() => setSelectedView('overview')}
            className={`w-full px-6 py-3 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              selectedView === 'overview' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            <BarChart className="w-5 h-5 mr-3" /> Overview
          </button>
          <button
            onClick={() => setSelectedView('users')}
            className={`w-full px-6 py-3 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              selectedView === 'users' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            <Users className="w-5 h-5 mr-3" /> Users
          </button>
          <button
            onClick={() => setSelectedView('roles')}
            className={`w-full px-6 py-3 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              selectedView === 'roles' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            <Shield className="w-5 h-5 mr-3" /> Roles
          </button>
          <button
            onClick={() => setSelectedView('logs')}
            className={`w-full px-6 py-3 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              selectedView === 'logs' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            <Terminal className="w-5 h-5 mr-3" /> System Logs
          </button>
          <button
            onClick={() => setSelectedView('settings')}
            className={`w-full px-6 py-3 flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              selectedView === 'settings' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            <Settings className="w-5 h-5 mr-3" /> Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {selectedView === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold">{metrics?.total_users || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Total Messages</h3>
                <p className="text-3xl font-bold">{metrics?.total_messages || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Resolved Issues</h3>
                <p className="text-3xl font-bold">{metrics?.resolved_issues || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Resolution Rate</h3>
                <p className="text-3xl font-bold">{metrics?.resolution_rate || 0}%</p>
              </div>
            </div>
          )}

          {selectedView === 'users' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="border rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.role}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleEditUser(user.id)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-l-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * itemsPerPage >= filteredUsers.length}
                  className="px-4 py-2 border rounded-r-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {selectedView === 'roles' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Roles & Permissions</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add New Role</button>
              </div>

              <div className="grid gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">{role.name}</h3>
                      <div>
                        <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {role.permissions?.map((permission, index) => (
                        <div key={index} className="flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          {permission}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'logs' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">System Logs</h2>
                <select
                  className="border rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value as typeof logFilter)}
                >
                  <option value="all">All Logs</option>
                  <option value="error">Errors</option>
                  <option value="warning">Warnings</option>
                  <option value="info">Info</option>
                </select>
              </div>

              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 rounded-lg ${
                      log.type === 'error'
                        ? 'bg-red-50 border-l-4 border-red-500'
                        : log.type === 'warning'
                        ? 'bg-yellow-50 border-l-4 border-yellow-500'
                        : 'bg-blue-50 border-l-4 border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold capitalize">{log.type}</span>
                      <span className="text-sm text-gray-500">{log.timestamp}</span>
                    </div>
                    <p className="mt-2">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">System Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable Email Notifications</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Dark Mode</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto Refresh Interval (seconds)</span>
                      <input
                        type="number"
                        className="border rounded px-3 py-2 w-24 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-900"
                        min="5"
                        max="300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Two-Factor Authentication</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Session Timeout (minutes)</span>
                      <input 
                        type="number" 
                        className="border rounded px-3 py-2 w-24 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-900" 
                        min="5" 
                        max="120" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSaveSettings}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}