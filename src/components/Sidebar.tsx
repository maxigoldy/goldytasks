import React from 'react';
import { Calendar, Tag, Star, Clock, CheckCircle, Plus } from 'lucide-react';
import { useTodos } from '../contexts/TodoContext';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onCategorySelect }) => {
  const { todos, categories } = useTodos();
  const { user } = useAuth();

  const getTaskCount = (filter: string) => {
    switch (filter) {
      case 'all':
        return todos.length;
      case 'today':
        const today = new Date().toDateString();
        return todos.filter(todo => 
          todo.scheduledDate && new Date(todo.scheduledDate).toDateString() === today
        ).length;
      case 'upcoming':
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return todos.filter(todo => 
          todo.scheduledDate && new Date(todo.scheduledDate) > tomorrow
        ).length;
      case 'completed':
        return todos.filter(todo => todo.completed).length;
      case 'high-priority':
        return todos.filter(todo => todo.priority === 'high' && !todo.completed).length;
      default:
        return todos.filter(todo => todo.category === filter).length;
    }
  };

  const quickFilters = [
    { id: 'all', label: 'All Tasks', icon: CheckCircle },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'upcoming', label: 'Upcoming', icon: Clock },
    { id: 'high-priority', label: 'High Priority', icon: Star },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
  ];

  return (
    <div className="w-64 bg-black-800 border-r border-gold-600/20 h-full flex flex-col">
      {/* Quick Filters */}
      <div className="p-6">
        <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">
          Quick Filters
        </h2>
        <nav className="space-y-1">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onCategorySelect(filter.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedCategory === filter.id
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'text-gold-300 hover:bg-gold-500/10 hover:text-gold-400'
              }`}
            >
              <div className="flex items-center">
                <filter.icon className="w-4 h-4 mr-3" />
                {filter.label}
              </div>
              <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-1 rounded-full">
                {getTaskCount(filter.id)}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Categories */}
      <div className="px-6 pb-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">
            Categories
          </h2>
          <button className="text-gold-400 hover:text-gold-300 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <nav className="space-y-1">
          {categories.filter(cat => 
            cat.id !== '5' || user?.isFamilyMember // Only show MovieNight to family members
          ).map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'text-gold-300 hover:bg-gold-500/10 hover:text-gold-400'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3 text-base">{category.icon}</span>
                {category.name}
              </div>
              <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-1 rounded-full">
                {getTaskCount(category.id)}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Premium Badge */}
      <div className="p-6 border-t border-gold-600/20">
        <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border border-gold-500/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 text-gold-500 mr-2" />
            <span className="text-sm font-semibold text-gold-400">Family Member</span>
          </div>
          <p className="text-xs text-gold-300 mb-3">
            Access family features and shared categories
          </p>
          {user?.isFamilyMember ? (
            <div className="text-center text-green-400 text-sm font-semibold">
              ✓ Active Member
            </div>
          ) : (
            <div className="text-center text-gold-400 text-sm">
              Contact admin for access
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;