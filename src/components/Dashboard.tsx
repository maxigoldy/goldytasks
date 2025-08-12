import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import Header from './Header';
import SettingsPage from './SettingsPage';
import ProfilePage from './ProfilePage';
import UserManagement from './UserManagement';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings' | 'profile' | 'users'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'settings':
        return <SettingsPage onBack={() => setCurrentPage('dashboard')} />;
      case 'profile':
        return <ProfilePage onBack={() => setCurrentPage('dashboard')} />;
      case 'users':
        return user?.role === 'admin' ? 
          <UserManagement onBack={() => setCurrentPage('dashboard')} /> : 
          <div>Access denied</div>;
      default:
        return (
          <>
            <Sidebar 
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TodoList 
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>
          </>
        );
    }
  };
  return (
    <div className="flex h-screen bg-black">
      {currentPage === 'dashboard' && (
        <div className="hidden lg:block">
          <Sidebar 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header 
          onNewTask={() => setShowTodoForm(true)}
          onSettings={() => setCurrentPage('settings')}
          onProfile={() => setCurrentPage('profile')}
          onUserManagement={user?.role === 'admin' ? () => setCurrentPage('users') : undefined}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {currentPage === 'dashboard' && (
            <div className="lg:hidden w-64 flex-shrink-0">
              <Sidebar 
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>
          )}
          {renderCurrentPage()}
        </div>
      </div>
      
      {showTodoForm && (
        <TodoForm onClose={() => setShowTodoForm(false)} />
      )}
    </div>
  );
};

export default Dashboard;