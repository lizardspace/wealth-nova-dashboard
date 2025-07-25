
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

// Simple placeholder for admin routes not yet implemented
export const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">Cette page est en cours de développement.</p>
  </div>
);

// Auth wrapper components
export const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
