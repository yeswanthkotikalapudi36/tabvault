import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Folder, RefreshCw, Bookmark, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  mobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobile }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/rediscover', icon: RefreshCw, label: 'Rediscover' },
  ];

  if (mobile) {
    return (
      <>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 w-full h-full text-xs font-medium",
              location.pathname === link.to ? "text-accent" : "text-gray-500"
            )}
          >
            <link.icon className="w-6 h-6" />
            <span>{link.label}</span>
          </Link>
        ))}
        <button
          onClick={() => logout()}
          className="flex flex-col items-center justify-center space-y-1 w-full h-full text-xs font-medium text-gray-500"
        >
          <LogOut className="w-6 h-6" />
          <span>Logout</span>
        </button>
      </>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Bookmark className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">TabVault</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors font-medium",
              location.pathname === link.to
                ? "bg-accent/10 text-accent"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => logout()}
          className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
