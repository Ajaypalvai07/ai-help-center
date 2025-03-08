import React, { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Sun, Moon } from 'lucide-react';
import UserProfile from './UserProfile';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    return localStorage.getItem('theme') || 'light';
  });
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen relative ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 animate-gradient-slow">
          {/* RGB Gradient Blobs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute -bottom-8 right-20 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
        </div>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      {/* Header */}
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg' 
            : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center cursor-pointer transform transition-transform duration-300 hover:scale-105" 
              onClick={() => navigate('/aihelpcentre')}
            >
              <div className="relative">
                <MessageSquare className="h-8 w-8 text-blue-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Help Center
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 transform hover:scale-110"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-600" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-300" />
                )}
              </button>

              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-20">
        <div className="relative z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 