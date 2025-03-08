import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../lib/api';
import { useStore } from '../store';
import type { Category } from '../types';
import { MessageSquare, Code, Box, User, Loader2 } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'General': <MessageSquare className="w-6 h-6" />,
  'Technical': <Code className="w-6 h-6" />,
  'Product': <Box className="w-6 h-6" />,
  'Account': <User className="w-6 h-6" />
};

const categoryColors: Record<string, { bg: string, hover: string, text: string }> = {
  'General': { 
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    hover: 'hover:from-blue-600 hover:to-blue-700',
    text: 'text-blue-100'
  },
  'Technical': { 
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    hover: 'hover:from-purple-600 hover:to-purple-700',
    text: 'text-purple-100'
  },
  'Product': { 
    bg: 'bg-gradient-to-br from-green-500 to-green-600',
    hover: 'hover:from-green-600 hover:to-green-700',
    text: 'text-green-100'
  },
  'Account': { 
    bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    hover: 'hover:from-orange-600 hover:to-orange-700',
    text: 'text-orange-100'
  }
};

export default function CategorySelector() {
  const [categoriesList, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { auth: { user } } = useStore();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categories.getAll();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8 bg-red-50 rounded-lg">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome, {user?.name || 'Guest'}
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Select a category to start chatting with our AI assistant
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {categoriesList.map((category) => {
          const colorScheme = categoryColors[category.name] || categoryColors['General'];
          const icon = categoryIcons[category.name];

          return (
            <div
              key={category.id}
              onClick={() => navigate(`/chat/${category.id}`)}
              className={`transform transition-all duration-300 hover:scale-105 cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl ${colorScheme.bg} ${colorScheme.hover}`}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    {icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className={`${colorScheme.text} text-sm opacity-90`}>
                  {category.description}
                </p>
              </div>
              <div className="h-2 w-full bg-white/20" />
            </div>
          );
        })}
      </div>
    </div>
  );
}