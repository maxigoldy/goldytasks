import React from 'react';
import { Search, Plus, Bell, Settings, LogOut, Crown, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNewTask: () => void;
  onSettings: () => void;
  onProfile: () => void;
  onUserManagement?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onNewTask, 
  onSettings, 
  onProfile, 
  onUserManagement, 
  searchQuery, 
  onSearchChange 
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-black-800 border-b border-gold-600/20 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <Crown className="w-6 h-6 text-gold-500" />
            <h1 className="text-lg sm:text-xl font-serif font-bold text-gold-500">FamilyTasks</h1>
          </div>
          
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gold-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 w-60 lg:w-80 bg-black-700 border border-gold-600/30 rounded-lg text-white placeholder-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onNewTask}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {user?.role === 'admin' && onUserManagement && (
            <button
              onClick={onUserManagement}
              className="p-2 text-gold-400 hover:text-gold-300 transition-colors"
            >
              <Users className="w-5 h-5" />
            </button>
          )}

          <button className="p-2 text-gold-400 hover:text-gold-300 transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          <button 
            onClick={onSettings}
            className="p-2 text-gold-400 hover:text-gold-300 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gold-400">{user?.email}</p>
            </div>
            <button
              onClick={onProfile}
              className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center hover:from-gold-300 hover:to-gold-500 transition-all"
            >
              <span className="text-black text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </button>
            <button
              onClick={logout}
              className="p-2 text-gold-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="mt-4 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gold-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-black-700 border border-gold-600/30 rounded-lg text-white placeholder-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;