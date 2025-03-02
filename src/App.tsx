import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import CategorySelector from './components/CategorySelector';
import Chat from './components/Chat';
import LoginForm from './components/Auth/LoginForm';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import { useStore } from './store';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import SessionCheck from './components/SessionCheck';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user } = useStore();
  
  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/aihelpcentre" />;
  }
  
  return <>{children}</>;
}

function App() {
  const { user } = useStore();

  return (
    <AuthProvider>
      <Router>
        <SessionCheck />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/auth/signup" element={<LoginForm isSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Routes */}
          <Route
            path="/aihelpcentre"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategorySelector />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/chat/:categoryId"
            element={
              <ProtectedRoute>
                <Layout>
                  <Chat />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;