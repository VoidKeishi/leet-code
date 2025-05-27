import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemsService, todosService } from '../../services/database';
import { Problem, TodoItem } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Calendar, CheckCircle, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [problemsResult, todosResult] = await Promise.all([
        problemsService.getAllProblems(),
        todosService.getAllTodos()
      ]);

      if (problemsResult.data) setProblems(problemsResult.data);
      if (todosResult.data) setTodos(todosResult.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: problems.length,
    easy: problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard: problems.filter(p => p.difficulty === 'Hard').length,
    pendingTodos: todos.filter(t => !t.completed).length,
    completedTodos: todos.filter(t => t.completed).length,
  };

  const chartData = [
    { name: 'Easy', count: stats.easy, fill: '#10B981' },
    { name: 'Medium', count: stats.medium, fill: '#F59E0B' },
    { name: 'Hard', count: stats.hard, fill: '#EF4444' },
  ];

  const recentProblems = problems.slice(0, 5);
  const upcomingTodos = todos.filter(t => !t.completed).slice(0, 5);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/problems/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Problem
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Problems</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Easy</p>
              <p className="text-2xl font-bold text-green-600">{stats.easy}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medium</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hard</p>
              <p className="text-2xl font-bold text-red-600">{stats.hard}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Problems by Difficulty</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Problems */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Problems</h3>
            <Link to="/problems" className="text-indigo-600 hover:text-indigo-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentProblems.map((problem) => (
              <div key={problem.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <Link 
                    to={`/problems/${problem.id}`}
                    className="font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {problem.number}. {problem.title}
                  </Link>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 text-xs rounded ${
                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {recentProblems.length === 0 && (
              <p className="text-gray-500 text-center py-4">No problems yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Todos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Todos</h3>
          <Link to="/planning" className="text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {upcomingTodos.map((todo) => (
            <div key={todo.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium text-gray-900">{todo.problem_title}</p>
                <p className="text-sm text-gray-600">Due: {new Date(todo.deadline).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                todo.priority === 'High' ? 'bg-red-100 text-red-800' :
                todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {todo.priority}
              </span>
            </div>
          ))}
          {upcomingTodos.length === 0 && (
            <p className="text-gray-500 text-center py-4">No pending todos</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;