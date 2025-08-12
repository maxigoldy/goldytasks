import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TodoProvider } from './contexts/TodoContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-serif font-bold text-gold-500">GoldTasks</h1>
          <p className="text-gold-300 mt-2">Loading your premium experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <TodoProvider>
      <Dashboard />
    </TodoProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;