import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthRoute } from './components/AuthRoute';

// Pages (Lazy loaded later for optimization, but standard for now)
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const CollectionView = React.lazy(() => import('./pages/CollectionView'));
const RediscoverPage = React.lazy(() => import('./pages/RediscoverPage'));

// Layout components
import { Layout } from './components/Layout';

export default function App() {
  const { user } = useAuth();

  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route element={<AuthRoute><Layout /></AuthRoute>}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/collection/:id" element={<CollectionView />} />
          <Route path="/rediscover" element={<RediscoverPage />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
}
