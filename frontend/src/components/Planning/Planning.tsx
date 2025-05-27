import React, { useState, useEffect } from 'react';
import { todosService } from '../../services/database';
import { TodoItem } from '../../types';
import { Plus, Calendar, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { format, parseISO, isBefore, isToday } from 'date-fns';

const Planning: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [formData, setFormData] = useState({
    problem_number: 0,
    problem_title: '',
    deadline: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    notes: '',
  });

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const { data, error } = await todosService.getAllTodos();
      if (error) throw error;
      if (data) setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTodo) {
        await todosService.updateTodo(editingTodo.id, formData);
      } else {
        await todosService.createTodo(formData);
      }
      await loadTodos();
      resetForm();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await todosService.markComplete(id);
      await loadTodos();
    } catch (error) {
      console.error('Error completing todo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todosService.deleteTodo(id);
        await loadTodos();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleEdit = (todo: TodoItem) => {
    setEditingTodo(todo);
    setFormData({
      problem_number: todo.problem_number,
      problem_title: todo.problem_title,
      deadline: todo.deadline.split('T')[0], // Format for date input
      priority: todo.priority,
      notes: todo.notes || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTodo(null);
    setFormData({
      problem_number: 0,
      problem_title: '',
      deadline: '',
      priority: 'Medium',
      notes: '',
    });
  };

  const getTodoStatus = (todo: TodoItem) => {
    if (todo.completed) return 'completed';
    const deadline = parseISO(todo.deadline);
    if (isBefore(deadline, new Date()) && !isToday(deadline)) return 'overdue';
    if (isToday(deadline)) return 'due-today';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'due-today': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const groupedTodos = {
    pending: todos.filter(t => !t.completed),
    completed: todos.filter(t => t.completed),
  };

  if (loading) {
    return <div className="text-center py-8">Loading todos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Planning</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Todo
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingTodo ? 'Edit Todo' : 'Add New Todo'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Number
                </label>
                <input
                  type="number"
                  required
                  value={formData.problem_number || ''}
                  onChange={(e) => setFormData({ ...formData, problem_number: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Title
              </label>
              <input
                type="text"
                required
                value={formData.problem_title}
                onChange={(e) => setFormData({ ...formData, problem_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Two Sum"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {editingTodo ? 'Update' : 'Add'} Todo
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pending Todos */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Pending ({groupedTodos.pending.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {groupedTodos.pending.map((todo) => {
            const status = getTodoStatus(todo);
            return (
              <div key={todo.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">
                        #{todo.problem_number}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {todo.problem_title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(todo.priority)}`}>
                        {todo.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
                        {status === 'due-today' ? 'Due Today' : 
                         status === 'overdue' ? 'Overdue' : 
                         status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {format(parseISO(todo.deadline), 'MMM dd, yyyy')}
                      {todo.notes && (
                        <span className="ml-4 text-gray-500">• {todo.notes}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleComplete(todo.id)}
                      className="p-2 text-green-400 hover:text-green-600"
                      title="Mark as complete"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(todo)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-2 text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {groupedTodos.pending.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No pending todos. Add one to get started!
            </div>
          )}
        </div>
      </div>

      {/* Completed Todos */}
      {groupedTodos.completed.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Completed ({groupedTodos.completed.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {groupedTodos.completed.map((todo) => (
              <div key={todo.id} className="px-6 py-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">
                        #{todo.problem_number}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900 line-through">
                        {todo.problem_title}
                      </h3>
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      Was due: {format(parseISO(todo.deadline), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Planning;