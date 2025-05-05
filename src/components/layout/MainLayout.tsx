
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-0">
          <div className="h-full p-5 md:p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
