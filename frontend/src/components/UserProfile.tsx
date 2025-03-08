import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown, Shield } from 'lucide-react';
import { useStore } from '../store';

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { auth: { user }, signOut } = useStore();

  const handleLogout = () => {
    signOut();
    navigate('/', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center transform transition-transform group-hover:scale-110">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {user.name || 'User'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {user.role}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 transform transition-all duration-300 scale-100 origin-top-right">
          <div className="py-1" role="menu">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user.email}
              </p>
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Dashboard
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 