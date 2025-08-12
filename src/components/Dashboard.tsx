import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import Header from './Header';

const Dashboard = () => {
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-black">
      <Sidebar 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onNewTask={() => setShowTodoForm(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <TodoList 
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      </div>
      
      {showTodoForm && (
        <TodoForm onClose={() => setShowTodoForm(false)} />
      )}
    </div>
  );
};

export default Dashboard;