
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
