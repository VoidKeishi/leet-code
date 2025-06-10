import React, { useState } from 'react';
import { Lock, User, X } from 'lucide-react';
import { authService } from '../../services/supabase';
import { coreColors } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

interface LoginProps {
  onLogin: (success: boolean) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose, isModal = false }) => {
  const [email] = useState('phananha4@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  // Define colors based on theme using Material Design 3 tokens
  const colors = {
    surface: theme === 'dark' ? coreColors.neutral[10] : coreColors.neutral[99],
    onSurface: theme === 'dark' ? coreColors.neutral[90] : coreColors.neutral[10],
    surfaceVariant: theme === 'dark' ? coreColors.neutralVariant[30] : coreColors.neutralVariant[90],
    onSurfaceVariant: theme === 'dark' ? coreColors.neutralVariant[80] : coreColors.neutralVariant[30],
    outline: theme === 'dark' ? coreColors.neutralVariant[60] : coreColors.neutralVariant[50],
    outlineVariant: theme === 'dark' ? coreColors.neutralVariant[30] : coreColors.neutralVariant[80],
    primary: theme === 'dark' ? coreColors.primary[80] : coreColors.primary[40],
    onPrimary: theme === 'dark' ? coreColors.primary[20] : coreColors.primary[100],
    primaryContainer: theme === 'dark' ? coreColors.primary[30] : coreColors.primary[90],
    surfaceContainer: theme === 'dark' ? coreColors.neutral[17] : coreColors.neutral[94],
    error: theme === 'dark' ? coreColors.error[80] : coreColors.error[40],
    errorContainer: theme === 'dark' ? coreColors.error[30] : coreColors.error[90],
    onErrorContainer: theme === 'dark' ? coreColors.error[90] : coreColors.error[10],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await authService.signIn(email, password);

    if (authError) {
      setError(authError.message || 'Failed to sign in. Please check credentials.');
      onLogin(false);
    } else if (data.user) {
      onLogin(true);
    } else {
      setError('Login failed. An unexpected error occurred.');
      onLogin(false);
    }

    setLoading(false);
  };

  const content = (
    <div className={`${isModal ? 'w-full max-w-md mx-4' : 'sm:mx-auto sm:w-full sm:max-w-md'}`}>
      <div 
        className={`py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 ${isModal ? 'rounded-lg' : ''}`}
        style={{ 
          backgroundColor: colors.surface, 
          border: `1px solid ${colors.outlineVariant}` 
        }}
      >
        {isModal && onClose && (
          <div className="flex justify-between items-center mb-6">
            <h2 
              className="text-2xl font-bold"
              style={{ color: colors.onSurface }}
            >
              Login Required
            </h2>
            <button
              onClick={onClose}
              className="transition-colors hover:opacity-75"
              style={{ color: colors.onSurfaceVariant }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}
        
        {!isModal && (
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Lock className="w-6 h-6" style={{ color: colors.onPrimary }} />
              </div>
            </div>
            <h2 
              className="mt-6 text-center text-3xl font-extrabold"
              style={{ color: colors.onSurface }}
            >
              Keishi's LeetCode Tracker
            </h2>
            <p 
              className="mt-2 text-center text-sm"
              style={{ color: colors.onSurfaceVariant }}
            >
              Enter your password to access admin features
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium"
              style={{ color: colors.onSurface }}
            >
              Admin Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-2 rounded-md sm:text-sm focus:outline-none transition-colors"
                style={{
                  backgroundColor: colors.surfaceContainer,
                  border: `1px solid ${colors.outline}`,
                  color: colors.onSurface
                }}
                placeholder="Enter admin password"
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.outline;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {error && (
            <div 
              className="text-sm text-center p-3 rounded-md"
              style={{
                backgroundColor: colors.errorContainer,
                color: colors.onErrorContainer,
                border: `1px solid ${colors.error}`
              }}
            >
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border-0 rounded-md shadow-sm text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.primary,
                color: colors.onPrimary
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  const hoverColor = theme === 'dark' ? coreColors.primary[70] : coreColors.primary[30];
                  e.currentTarget.style.backgroundColor = hoverColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div 
            className="text-center text-sm"
            style={{ color: colors.onSurfaceVariant }}
          >
            {isModal ? 
              'Login to create, edit, and manage problems and todos.' :
              'This is Keishi\'s personal LeetCode management system.'
            }
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        {content}
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {content}
      </div>
    </div>
  );
};

export default Login;