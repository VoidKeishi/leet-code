import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Upload, Download, ExternalLink, CheckCircle, Circle, FileText, X } from 'lucide-react';
import { colors } from '../../theme/colors';
import { todosService } from '../../services/database';
import { TodoItem } from '../../types';

interface PlanningProps {
  isGuest?: boolean;
}

const Planning: React.FC<PlanningProps> = ({ isGuest = false }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    notes: '',
  });

  const jsonTemplate = [
    {
      "name": "Two Sum",
      "link": "https://leetcode.com/problems/two-sum/",
      "difficulty": "Easy",
      "notes": "Review hash map approach",
      "completed": false
    },
    {
      "name": "3Sum",
      "link": "https://leetcode.com/problems/3sum/",
      "difficulty": "Medium",
      "notes": "Focus on two-pointer technique",
      "completed": false
    }
  ];

  // Load todos from Supabase on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await todosService.getAllTodos();
      if (error) {
        setError(error.message);
      } else {
        setTodos(data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.link.trim()) return;

    try {
      const { data, error } = await todosService.createTodo({
        name: formData.name.trim(),
        link: formData.link.trim(),
        difficulty: formData.difficulty,
        notes: formData.notes.trim(),
      });

      if (error) {
        setError(error.message);
      } else {
        setTodos(prev => [data, ...prev]);
        setFormData({
          name: '',
          link: '',
          difficulty: 'Medium',
          notes: '',
        });
        setShowForm(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const { error } = await todosService.updateTodo(id, {
        completed: !todo.completed
      });

      if (error) {
        setError(error.message);
      } else {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
    }
  };

  const deleteTodo = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        const { error } = await todosService.deleteTodo(id);
        if (error) {
          setError(error.message);
        } else {
          setTodos(prev => prev.filter(todo => todo.id !== id));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete todo');
      }
    }
  };

  const importFromJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const importedTodos = JSON.parse(e.target?.result as string);
            if (Array.isArray(importedTodos)) {
              let successCount = 0;
              for (const todo of importedTodos) {
                try {
                  const { data, error } = await todosService.createTodo({
                    name: todo.name || 'Unnamed Problem',
                    link: todo.link || 'https://leetcode.com/',
                    difficulty: ['Easy', 'Medium', 'Hard'].includes(todo.difficulty) ? todo.difficulty : 'Medium',
                    notes: todo.notes || '',
                  });
                  
                  if (!error && data) {
                    successCount++;
                  }
                } catch (err) {
                  console.error('Error importing todo:', err);
                }
              }
              
              if (successCount > 0) {
                await fetchTodos(); // Refresh the list
                alert(`Successfully imported ${successCount} todos!`);
              } else {
                alert('No todos were imported. Please check the format.');
              }
            } else {
              alert('Invalid JSON format. Expected an array of todos.');
            }
          } catch (error) {
            alert('Error parsing JSON file. Please check the format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const exportToJSON = () => {
    const exportData = todos.map(todo => ({
      name: todo.name,
      link: todo.link,
      difficulty: todo.difficulty,
      notes: todo.notes,
      completed: todo.completed
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leetcode-todos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return `${colors.difficulty.easy.bg} ${colors.difficulty.easy.text}`;
      case 'Medium':
        return `${colors.difficulty.medium.bg} ${colors.difficulty.medium.text}`;
      case 'Hard':
        return `${colors.difficulty.hard.bg} ${colors.difficulty.hard.text}`;
      default:
        return `${colors.difficulty.medium.bg} ${colors.difficulty.medium.text}`;
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (loading) {
    return (
      <div className={`container mx-auto px-4 py-8 ${colors.background.primary} text-center`}>
        <div className={`text-lg ${colors.text.primary}`}>Loading todos...</div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${colors.background.primary}`}>
      {/* Error Display */}
      {error && (
        <div className={`mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg`}>
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${colors.text.primary} mb-4 md:mb-0`}>
            Planning & Todo List
          </h1>
          {isGuest && (
            <p className={`text-sm ${colors.text.secondary}`}>
              Viewing in guest mode. Login to add, edit, or delete todos.
            </p>
          )}
        </div>
        {!isGuest && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${colors.text.inverse} ${colors.button.primary}`}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Todo
            </button>
            <button
              onClick={() => setShowTemplate(true)}
              className={`inline-flex items-center px-4 py-2 border ${colors.border.primary} rounded-md shadow-sm text-sm font-medium ${colors.text.secondary} ${colors.background.card} ${colors.background.hover}`}
            >
              <FileText className="mr-2 h-5 w-5" />
              JSON Template
            </button>
            <button
              onClick={importFromJSON}
              className={`inline-flex items-center px-4 py-2 border ${colors.border.primary} rounded-md shadow-sm text-sm font-medium ${colors.text.secondary} ${colors.background.card} ${colors.background.hover}`}
            >
              <Upload className="mr-2 h-5 w-5" />
              Import JSON
            </button>
            <button
              onClick={exportToJSON}
              disabled={todos.length === 0}
              className={`inline-flex items-center px-4 py-2 border ${colors.border.primary} rounded-md shadow-sm text-sm font-medium ${colors.text.secondary} ${colors.background.card} ${colors.background.hover} ${todos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download className="mr-2 h-5 w-5" />
              Export JSON
            </button>
          </div>
        )}
      </div>

      {/* JSON Template Modal */}
      {showTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${colors.background.card} rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden`}>
            <div className={`flex justify-between items-center p-6 border-b ${colors.border.primary}`}>
              <h2 className={`text-xl font-semibold ${colors.text.primary}`}>JSON Import Template</h2>
              <button
                onClick={() => setShowTemplate(false)}
                className={`${colors.text.muted} hover:${colors.text.primary}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className={`${colors.text.secondary} mb-4`}>
                Use this format when importing todos from a JSON file:
              </p>
              <pre className={`${colors.background.primary} border ${colors.border.primary} rounded-lg p-4 text-sm overflow-x-auto`}>
                <code className={`${colors.text.primary}`}>
                  {JSON.stringify(jsonTemplate, null, 2)}
                </code>
              </pre>
              <div className={`mt-4 text-sm ${colors.text.secondary}`}>
                <p><strong>Fields:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>name:</strong> Problem name (string, required)</li>
                  <li><strong>link:</strong> LeetCode problem URL (string, required)</li>
                  <li><strong>difficulty:</strong> Easy, Medium, or Hard (string)</li>
                  <li><strong>notes:</strong> Additional notes (string, optional)</li>
                  <li><strong>completed:</strong> Whether the todo is completed (boolean)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Todo Form */}
      {showForm && (
        <div className={`p-6 rounded-lg shadow ${colors.background.card} border ${colors.border.primary} mb-8`}>
          <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>Add New Todo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                  Problem Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus}`}
                  placeholder="Two Sum"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                  LeetCode Link *
                </label>
                <input
                  type="url"
                  required
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus}`}
                  placeholder="https://leetcode.com/problems/two-sum/"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus}`}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus} resize-y`}
                placeholder="Add any notes, approach ideas, or reminders..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`px-4 py-2 border ${colors.border.primary} rounded-md shadow-sm text-sm font-medium ${colors.text.secondary} ${colors.background.card} ${colors.background.hover}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${colors.text.inverse} ${colors.button.primary}`}
              >
                Add Todo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      {todos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-lg ${colors.background.card} border ${colors.border.primary}`}>
            <div className={`text-2xl font-bold ${colors.text.primary}`}>{todos.length}</div>
            <div className={`text-sm ${colors.text.secondary}`}>Total Problems</div>
          </div>
          <div className={`p-4 rounded-lg ${colors.background.card} border ${colors.border.primary}`}>
            <div className={`text-2xl font-bold ${colors.text.primary}`}>{activeTodos.length}</div>
            <div className={`text-sm ${colors.text.secondary}`}>Pending</div>
          </div>
          <div className={`p-4 rounded-lg ${colors.background.card} border ${colors.border.primary}`}>
            <div className={`text-2xl font-bold ${colors.text.primary}`}>{completedTodos.length}</div>
            <div className={`text-sm ${colors.text.secondary}`}>Completed</div>
          </div>
        </div>
      )}

      {/* Todo Lists */}
      <div className="space-y-8">
        {/* Active Todos */}
        <div>
          <h2 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>
            Pending ({activeTodos.length})
          </h2>
          {activeTodos.length > 0 ? (
            <div className="space-y-3">
              {activeTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={isGuest ? () => {} : toggleComplete}
                  onDelete={isGuest ? () => {} : deleteTodo}
                  getDifficultyColor={getDifficultyColor}
                  isGuest={isGuest}
                />
              ))}
            </div>
          ) : (
            <div className={`p-8 text-center ${colors.background.card} border ${colors.border.primary} rounded-lg`}>
              <p className={`${colors.text.secondary}`}>
                {isGuest ? 'No pending todos to display.' : 'No pending todos. Add one to get started!'}
              </p>
            </div>
          )}
        </div>

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
          <div>
            <h2 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>
              Completed ({completedTodos.length})
            </h2>
            <div className="space-y-3">
              {completedTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={isGuest ? () => {} : toggleComplete}
                  onDelete={isGuest ? () => {} : deleteTodo}
                  getDifficultyColor={getDifficultyColor}
                  isGuest={isGuest}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface TodoCardProps {
  todo: TodoItem;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  isGuest?: boolean;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onToggleComplete, onDelete, getDifficultyColor, isGuest = false }) => {
  return (
    <div className={`p-4 rounded-lg ${colors.background.card} border ${colors.border.primary} ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {!isGuest && (
            <button
              onClick={() => onToggleComplete(todo.id)}
              className={`mt-1 ${todo.completed ? colors.action.complete : colors.text.muted} hover:${colors.action.complete}`}
            >
              {todo.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className={`font-medium ${colors.text.primary} ${todo.completed ? 'line-through' : ''}`}>
                {todo.name}
              </h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(todo.difficulty)}`}>
                {todo.difficulty}
              </span>
              <a
                href={todo.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${colors.text.primary} hover:${colors.text.secondary}`}
                title="Open LeetCode problem"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            {todo.notes && (
              <p className={`text-sm ${colors.text.secondary} ${todo.completed ? 'line-through' : ''}`}>
                {todo.notes}
              </p>
            )}
            {todo.created_at && (
              <p className={`text-xs ${colors.text.muted} mt-2`}>
                Added {new Date(todo.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {!isGuest && (
          <button
            onClick={() => onDelete(todo.id)}
            className={`ml-3 ${colors.action.delete} p-1 rounded hover:bg-red-100 dark:hover:bg-red-900`}
            title="Delete todo"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Planning;