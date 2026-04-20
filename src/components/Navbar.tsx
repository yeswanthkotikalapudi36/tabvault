import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-bottom border-gray-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="md:hidden flex items-center space-x-2">
         {/* Small logo for mobile top nav */}
         <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
      </div>

      <div className="flex-1 max-w-xl mx-4 hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent" />
          <input
            type="text"
            placeholder="Search your library..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2 p-1 pl-1 pr-3 hover:bg-gray-100 rounded-full cursor-pointer transition-colors border border-gray-100">
          <div className="w-8 h-8 bg-accent/20 text-accent rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-700 hidden lg:block">
            {user?.displayName || user?.email?.split('@')[0]}
          </span>
        </div>
      </div>
    </header>
  );
};
