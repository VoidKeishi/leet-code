import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, CalendarIcon, ChartBarIcon, ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';
import { colors } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogin, onLogout }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Problems', href: '/problems', icon: BookOpenIcon },
    { name: 'Planning', href: '/planning', icon: CalendarIcon },
    { name: 'Graph', href: '/graph', icon: ChartBarIcon },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`${colors.background.card} shadow-lg border-b ${colors.border.primary}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className={`w-8 h-8 ${colors.primary.bg} rounded-lg flex items-center justify-center mr-3`}>
                  <span className={`text-sm font-bold ${colors.text.inverse}`}>{"</>"}</span>
                </div>
                <span className={`text-xl font-bold ${colors.text.primary}`}>
                  Keishi's LeetCode Tracker
                </span>
                {!isAuthenticated && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-md ${colors.difficulty.medium.bg} ${colors.difficulty.medium.text}`}>
                    Guest Mode
                  </span>
                )}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? `${colors.primary.border} ${colors.primary.text}`
                        : `border-transparent ${colors.text.secondary} ${colors.text.linkHover}`
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md transition-colors ${colors.background.hover} ${colors.text.secondary}`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Auth button */}
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors ${colors.button.secondary}`}
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </button>
            ) : (
              <button
                onClick={onLogin}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors ${colors.button.primary}`}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className={`pt-2 pb-3 space-y-1 border-t ${colors.border.primary}`}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  isActive
                    ? `${colors.primary.border} ${colors.primary.bg} ${colors.primary.text}`
                    : `border-transparent ${colors.text.secondary} ${colors.background.hover}`
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-4 space-x-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md transition-colors ${colors.background.hover} ${colors.text.secondary}`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              {isAuthenticated ? (
                <button
                  onClick={onLogout}
                  className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors ${colors.button.secondary}`}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={onLogin}
                  className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors ${colors.button.primary}`}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;