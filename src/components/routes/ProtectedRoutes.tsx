import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

const ProtectedRoutes = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoutes;
