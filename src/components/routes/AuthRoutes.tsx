import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';

type PublicOnlyRouteProps = {
  children: React.ReactNode;
};

const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AuthRoutes = () => {
  return (
    <>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
    </>
  );
};

export default AuthRoutes;
