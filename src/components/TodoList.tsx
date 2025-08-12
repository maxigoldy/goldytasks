import React, { useState } from 'react';
import { Calendar, Tag, Star, MoreHorizontal, CheckCircle, Circle, Share, Download } from 'lucide-react';
import { useTodos, Todo } from '../contexts/TodoContext';

interface TodoListProps {
  selectedCategory: string;
  searchQuery: string;
}

const TodoList: React.FC<TodoListProps> = ({ selectedCategory, searchQuery }) => {
  const { todos, updateTodo, deleteTodo, categories, exportToCalendar } = useTodos();
  const [selectedTodo, setSelectedTodo] = useState<string | null>(null);

  const getFilteredTodos = () => {
    let filtered = todos;

    // Apply category filter
    if (selectedCategory !== 'all') {
      switch (selectedCategory) {
        case 'today':
          const today = new Date().toDateString();
          filtered = todos.filter(todo => 
            todo.scheduledDate && new Date(todo.scheduledDate).toDateString() === today
          );
          break;
        case 'upcoming':
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          filtered = todos.filter(todo => 
            todo.scheduledDate && new Date(todo.scheduledDate) > tomorrow
          );
          break;
        case 'completed':
          filtered = todos.filter(todo => todo.completed);
          break;
        case 'high-priority':
          filtered = todos.filter(todo => todo.priority === 'high' && !todo.completed);
          break;
        default:
          filtered = todos.filter(todo => todo.category === selectedCategory);
      }
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gold-400';
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'Unknown', icon: '📝', color: 'gold' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleToggleComplete = (todo: Todo) => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const handleShare = async (todo: Todo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: todo.title,
          text: todo.description || '',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${todo.title}\n${todo.description || ''}\n\nShared from GoldTasks`;
      navigator.clipboard.writeText(shareText);
    }
  };

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-gold-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
          <p className="text-gold-400">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first task to get started'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="space-y-3">
        {filteredTodos.map((todo) => {
          const categoryInfo = getCategoryInfo(todo.category);
          
          return (
            <div
              key={todo.id}
              className={`bg-black-800 border border-gold-600/20 rounded-lg p-4 hover:border-gold-500/40 transition-all duration-200 ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleComplete(todo)}
                  className="mt-1 text-gold-400 hover:text-gold-300 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${todo.completed ? 'line-through text-gold-400/60' : 'text-white'}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-sm mt-1 ${todo.completed ? 'text-gold-400/40' : 'text-gold-300'}`}>
                          {todo.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleShare(todo)}
                        className="p-1 text-gold-400 hover:text-gold-300 transition-colors"
                      >
                        <Share className="w-4 h-4" />
                      </button>
                      {todo.scheduledDate && (
                        <button
                          onClick={() => exportToCalendar(todo.id)}
                          className="p-1 text-gold-400 hover:text-gold-300 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedTodo(selectedTodo === todo.id ? null : todo.id)}
                        className="p-1 text-gold-400 hover:text-gold-300 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center space-x-4 mt-3">
                    {/* Category */}
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{categoryInfo.icon}</span>
                      <span className="text-xs text-gold-400">{categoryInfo.name}</span>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center space-x-1">
                      <Star className={`w-3 h-3 ${getPriorityColor(todo.priority)}`} />
                      <span className="text-xs text-gold-400 capitalize">{todo.priority}</span>
                    </div>

                    {/* Due Date */}
                    {todo.dueDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-gold-400" />
                        <span className="text-xs text-gold-400">Due {formatDate(todo.dueDate)}</span>
                      </div>
                    )}

                    {/* Scheduled Date */}
                    {todo.scheduledDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-400">Scheduled {formatDate(todo.scheduledDate)}</span>
                      </div>
                    )}

                    {/* Tags */}
                    {todo.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-gold-400" />
                        <div className="flex space-x-1">
                          {todo.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gold-500/20 text-gold-400 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {todo.tags.length > 2 && (
                            <span className="text-xs text-gold-400">+{todo.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              {selectedTodo === todo.id && (
                <div className="mt-3 pt-3 border-t border-gold-600/20">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // Edit functionality would go here
                        setSelectedTodo(null);
                      }}
                      className="px-3 py-1 text-xs bg-gold-500/20 text-gold-400 rounded hover:bg-gold-500/30 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        deleteTodo(todo.id);
                        setSelectedTodo(null);
                      }}
                      className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodoList;