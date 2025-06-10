import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemsService, todosService } from '../../services/database';
import { Problem, TodoItem } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BookOpen, Calendar, CheckCircle, Clock, Check } from 'lucide-react';
import { colors } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

interface DashboardProps {
  isGuest?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isGuest = false }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

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
    { name: 'Easy', count: stats.easy, fill: colors.chart.easy, color: colors.chart.easy },
    { name: 'Medium', count: stats.medium, fill: colors.chart.medium, color: colors.chart.medium },
    { name: 'Hard', count: stats.hard, fill: colors.chart.hard, color: colors.chart.hard },
  ];

  const recentProblems = problems.slice(0, 5);
  const upcomingTodos = todos.filter(t => !t.completed).slice(0, 5);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} (${value})`}
      </text>
    );
  };

  if (loading) {
    return <div className={`text-center py-8 ${colors.text.primary}`}>Loading dashboard...</div>;
  }

  return (
    <div className={`space-y-6 ${colors.background.primary} min-h-screen p-6`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${colors.text.primary}`}>Dashboard</h1>
          {isGuest && (
            <p className={`text-sm ${colors.text.secondary} mt-1`}>
              You're viewing in guest mode. Login to create and edit problems.
            </p>
          )}
        </div>
        {!isGuest && (
          <Link
            to="/problems/new"
            className={`px-4 py-2 rounded-md transition-colors ${colors.button.primary}`}
          >
            Add Problem
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${colors.background.card} p-6 rounded-lg shadow`}>
          <div className="flex items-center">
            <BookOpen className={`h-8 w-8 ${colors.primary.text}`} />
            <div className="ml-4">
              <p className={`text-sm font-medium ${colors.text.secondary} mb-1`}>Total Problems</p>
              <p className={`text-3xl font-bold ${colors.text.primary}`}>{stats.total}</p>
            </div>
          </div>
        </div>

        <div className={`${colors.difficulty.easy.bg} p-6 rounded-lg shadow`}>
          <div className="flex items-center">
            <CheckCircle className={`h-8 w-8 ${colors.difficulty.easy.text}`} />
            <div className="ml-4">
              <p className={`text-sm font-medium ${colors.difficulty.easy.text} mb-1`}>Easy</p>
              <p className={`text-3xl font-bold ${colors.difficulty.easy.text}`}>{stats.easy}</p>
            </div>
          </div>
        </div>

        <div className={`${colors.difficulty.medium.bg} p-6 rounded-lg shadow`}>
          <div className="flex items-center">
            <Clock className={`h-8 w-8 ${colors.difficulty.medium.text}`} />
            <div className="ml-4">
              <p className={`text-sm font-medium ${colors.difficulty.medium.text} mb-1`}>Medium</p>
              <p className={`text-3xl font-bold ${colors.difficulty.medium.text}`}>{stats.medium}</p>
            </div>
          </div>
        </div>

        <div className={`${colors.difficulty.hard.bg} p-6 rounded-lg shadow`}>
          <div className="flex items-center">
            <Calendar className={`h-8 w-8 ${colors.difficulty.hard.text}`} />
            <div className="ml-4">
              <p className={`text-sm font-medium ${colors.difficulty.hard.text} mb-1`}>Hard</p>
              <p className={`text-3xl font-bold ${colors.difficulty.hard.text}`}>{stats.hard}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Difficulty Chart */}
        <div className={`${colors.background.card} p-6 rounded-lg shadow`}>
          <h3 className={`text-lg font-medium ${colors.text.primary} mb-6`}>Problems Solved</h3>
          <div className="flex items-center justify-center gap-8">
            {/* Left Side - Circular Progress Indicator */}
            <div className="relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={450}
                    outerRadius={80}
                    innerRadius={60}
                    dataKey="count"
                    stroke="none"
                    paddingAngle={3}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Central Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex items-baseline">
                  <span className={`text-3xl font-bold ${colors.text.primary}`}>{stats.total}</span>
                  <span className={`text-lg ${colors.text.muted} ml-1`}>/100</span>
                </div>
                <div className="flex items-center mt-1">
                  <Check size={14} className="text-green-500 mr-1" />
                  <span className={`text-sm ${colors.text.secondary}`}>Solved</span>
                </div>
              </div>
            </div>

            {/* Right Side - Difficulty Breakdown Boxes */}
            <div className="flex flex-col gap-3">
              {/* Easy Box */}
              <div className={`${colors.background.secondary} p-3 rounded-lg min-w-[100px]`}>
                <div className={`text-sm font-medium ${colors.difficulty.easy.text}`}>Easy</div>
                <div className={`text-lg font-semibold ${colors.text.primary}`}>
                  {stats.easy}<span className={`${colors.text.muted}`}>/30</span>
                </div>
              </div>

              {/* Medium Box */}
              <div className={`${colors.background.secondary} p-3 rounded-lg min-w-[100px]`}>
                <div className={`text-sm font-medium ${colors.difficulty.medium.text}`}>Med.</div>
                <div className={`text-lg font-semibold ${colors.text.primary}`}>
                  {stats.medium}<span className={`${colors.text.muted}`}>/50</span>
                </div>
              </div>

              {/* Hard Box */}
              <div className={`${colors.background.secondary} p-3 rounded-lg min-w-[100px]`}>
                <div className={`text-sm font-medium ${colors.difficulty.hard.text}`}>Hard</div>
                <div className={`text-lg font-semibold ${colors.text.primary}`}>
                  {stats.hard}<span className={`${colors.text.muted}`}>/20</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Text Below the Circle */}
          <div className="text-center mt-4">
            <span className={`text-sm ${colors.text.muted}`}>0 Attempting</span>
          </div>
        </div>

        {/* Recent Problems */}
        <div className={`${colors.background.card} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-medium ${colors.text.primary}`}>Recent Problems</h3>
            <Link to="/problems" className={`${colors.text.link} ${colors.text.linkHover}`}>
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentProblems.map((problem) => (
              <div key={problem.id} className={`flex items-center justify-between p-3 border rounded-md ${colors.border.primary} ${colors.background.hover}`}>
                <div>
                  <Link 
                    to={`/problems/${problem.id}`}
                    className={`font-medium ${colors.text.primary} ${colors.text.linkHover}`}
                  >
                    {problem.number}. {problem.title}
                  </Link>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      problem.difficulty === 'Easy' ? `${colors.difficulty.easy.bg} ${colors.difficulty.easy.text}` :
                      problem.difficulty === 'Medium' ? `${colors.difficulty.medium.bg} ${colors.difficulty.medium.text}` :
                      `${colors.difficulty.hard.bg} ${colors.difficulty.hard.text}`
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {recentProblems.length === 0 && (
              <p className={`${colors.text.muted} text-center py-4`}>No problems yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Todos */}
      <div className={`${colors.background.card} p-6 rounded-lg shadow`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-medium ${colors.text.primary}`}>Recent Todos</h3>
          <Link to="/planning" className={`${colors.text.link} ${colors.text.linkHover}`}>
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {upcomingTodos.map((todo) => (
            <div key={todo.id} className={`flex items-center justify-between p-3 border rounded-md ${colors.border.primary} ${colors.background.hover}`}>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <p className={`font-medium ${colors.text.primary}`}>{todo.name}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    todo.difficulty === 'Easy' ? `${colors.difficulty.easy.bg} ${colors.difficulty.easy.text}` :
                    todo.difficulty === 'Medium' ? `${colors.difficulty.medium.bg} ${colors.difficulty.medium.text}` :
                    `${colors.difficulty.hard.bg} ${colors.difficulty.hard.text}`
                  }`}>
                    {todo.difficulty}
                  </span>
                  {todo.link && (
                    <a
                      href={todo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs ${colors.text.link} hover:${colors.text.linkHover}`}
                      title="Open LeetCode problem"
                    >
                      View Problem
                    </a>
                  )}
                </div>
                {todo.notes && (
                  <p className={`text-sm ${colors.text.secondary} mt-1`}>{todo.notes}</p>
                )}
              </div>
            </div>
          ))}
          {upcomingTodos.length === 0 && (
            <p className={`${colors.text.muted} text-center py-4`}>No pending todos</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;