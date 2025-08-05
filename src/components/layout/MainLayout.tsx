
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden relative">
      {/* Modern gradient background */}
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-0">
            <div className="h-full p-5 md:p-6 animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
