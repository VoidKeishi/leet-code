import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Calendar, Network, LogOut, Sun, Moon } from 'lucide-react';
import { colors } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/problems', label: 'Problems', icon: BookOpen },
    { path: '/planning', label: 'Planning', icon: Calendar },
    { path: '/graph', label: 'Graph', icon: Network },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`${colors.background.secondary} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className={`flex-shrink-0 ${colors.text.primary} font-bold text-xl`}>
              LeetCode Manager
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`${isActive(item.path)
                          ? `${colors.primary.border} ${colors.text.primary}`
                          : `border-transparent ${colors.text.secondary} ${colors.text.linkHover} hover:border-gray-300 dark:hover:border-gray-500`
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`${colors.button.ghost} p-2 rounded-md transition-colors`}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={onLogout}
              className={`${colors.text.secondary} ${colors.text.linkHover} p-2 rounded-md transition-colors`}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${isActive(item.path)
                    ? `${colors.primary.bg} ${colors.primary.border} ${colors.primary.text}`
                    : `border-transparent ${colors.text.secondary} ${colors.background.hover} hover:border-gray-300 dark:hover:border-gray-500`
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
              >
                <div className="flex items-center">
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
        <div className={`pt-4 pb-3 border-t ${colors.border.primary}`}>
          <div className="flex items-center px-5">
            <button
              onClick={toggleTheme}
              className={`${colors.button.ghost} p-2 rounded-md transition-colors w-full flex items-center justify-start`}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
              <span className={colors.text.secondary}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
          <div className="mt-3 px-2 space-y-1">
            <button
              onClick={onLogout}
              className={`block w-full text-left rounded-md px-3 py-2 text-base font-medium ${colors.text.secondary} ${colors.background.hover} transition-colors`}
            >
              <LogOut className="h-5 w-5 mr-2 inline-block" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;