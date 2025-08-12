import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  tags: string[];
  dueDate?: string;
  scheduledDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface TodoContextType {
  todos: Todo[];
  categories: Category[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  exportToCalendar: (todoId: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Work', color: 'gold', icon: '💼' },
    { id: '2', name: 'Personal', color: 'blue', icon: '🏠' },
    { id: '3', name: 'Health', color: 'green', icon: '💪' },
    { id: '4', name: 'Learning', color: 'purple', icon: '📚' },
  ]);

  useEffect(() => {
    const savedTodos = localStorage.getItem('goldtasks_todos');
    const savedCategories = localStorage.getItem('goldtasks_categories');
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('goldtasks_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('goldtasks_categories', JSON.stringify(categories));
  }, [categories]);

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const exportToCalendar = (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo || !todo.scheduledDate) return;

    const startDate = new Date(todo.scheduledDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GoldTasks//EN
BEGIN:VEVENT
UID:${todo.id}@goldtasks.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${todo.title}
DESCRIPTION:${todo.description || ''}
CATEGORIES:${todo.category}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${todo.title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <TodoContext.Provider value={{
      todos,
      categories,
      addTodo,
      updateTodo,
      deleteTodo,
      addCategory,
      deleteCategory,
      exportToCalendar,
    }}>
      {children}
    </TodoContext.Provider>
  );
};