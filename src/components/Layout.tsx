import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Hidden on mobile, shown on md+ */}
      <div className="hidden md:block w-64 border-r border-gray-200 bg-white">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar/Nav would go here as a bottom nav maybe, as per PRD "Single column layout, bottom navigation bar instead of sidebar" */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50">
        <Sidebar mobile />
      </div>
    </div>
  );
};
