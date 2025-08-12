import React, { useState } from 'react';
import { X, Calendar, Tag, Star, Clock } from 'lucide-react';
import { useTodos } from '../contexts/TodoContext';

interface TodoFormProps {
  onClose: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onClose }) => {
  const { addTodo, categories } = useTodos();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0]?.id || '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    scheduledDate: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addTodo({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      scheduledDate: formData.scheduledDate || undefined,
      tags: formData.tags,
      completed: false,
    });

    onClose();
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black-800 border border-gold-600/30 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gold-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-black-700 border border-gold-600/30 rounded-lg text-white placeholder-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gold-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-black-700 border border-gold-600/30 rounded-lg text-white placeholder-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Add a description..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gold-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 bg-black-700 border border-gold-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gold-300 mb-2">
              Priority
            </label>
            <div className="flex space-x-2">
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority }))}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === priority
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                      : 'bg-black-700 text-gold-300 border border-gold-600/30 hover:bg-gold-500/10'
                  }`}
                >
                  <Star className={`w-4 h-4 mx-auto mb-1 ${
                    priority === 'high' ? 'text-red-400' :
                    priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 bg-black-700 border border-gold-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Scheduled
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full px-3 py-2 bg-black-700 border border-gold-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gold-300 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3 py-2 bg-black-700 border border-gold-600/30 rounded-lg text-white placeholder-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="Type and press Enter to add tags"
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gold-500/20 text-gold-400 text-xs rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gold-400 hover:text-gold-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-black-700 text-gold-300 rounded-lg hover:bg-black-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-200"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;