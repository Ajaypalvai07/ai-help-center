import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { auth } from '../../lib/api';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  isSignup?: boolean;
}

interface AuthError {
  message: string;
  status?: number;
}

interface SuccessMessage {
  message: string;
  type: 'success' | 'error';
}

export default function LoginForm({ isSignup = false }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [success, setSuccess] = useState<SuccessMessage | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isSignup) {
        await auth.signup({
          email: formData.email,
          password: formData.password,
          name: formData.name
        });
        
        setSuccess({
          message: 'Account created successfully! Please login with your credentials.',
          type: 'success'
        });

        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        try {
          const response = await login(formData.email, formData.password);
          
          if (!response.user) {
            throw new Error('Invalid response: missing user data');
          }

          // Navigate based on role
          if (response.user.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/aihelpcentre', { replace: true });
          }
        } catch (loginError: any) {
          console.error('Login error:', loginError);
          setError({
            message: loginError.message || 'Failed to login. Please check your credentials.',
            status: loginError.response?.status
          });
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError({
        message: error.message || 'Authentication failed',
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-[length:30px_30px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
        {/* Animated circles */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 0.9, 1],
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 0.9, 1],
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 0.9, 1],
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
            delay: 4
          }}
          className="absolute bottom-0 left-50 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full mx-4"
      >
        {/* Back to Home Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="absolute -top-12 left-0 text-white flex items-center space-x-2 hover:text-blue-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </motion.button>

        {/* Glass Card */}
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-blue-100">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => navigate(isSignup ? '/auth/login' : '/auth/signup')}
                className="font-medium text-white hover:text-blue-200 underline decoration-2 underline-offset-4 transition-colors"
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm text-center backdrop-blur-sm"
              >
                {error.message}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 text-white p-3 rounded-lg text-sm text-center backdrop-blur-sm"
              >
                {success.message}
              </motion.div>
            )}

            <div className="space-y-4">
              {isSignup && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-100" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={isSignup}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 w-full bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Full name"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-100" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 w-full bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Email address"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-100" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 w-full bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Password"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100 hover:text-blue-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !!success}
              className="relative w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg py-2.5 px-4 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isSignup ? 'Create Account' : 'Sign In'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
} 