
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
