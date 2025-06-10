// Theme color configuration for centralized color management
export const colors = {
  // Primary brand colors
  primary: {
    50: 'bg-indigo-50 dark:bg-indigo-950',
    100: 'bg-indigo-100 dark:bg-indigo-900',
    500: 'bg-indigo-500',
    600: 'bg-indigo-600',
    700: 'bg-indigo-700',
    text: 'text-indigo-600 dark:text-indigo-400',
    textHover: 'hover:text-indigo-700 dark:hover:text-indigo-300',
    bg: 'bg-indigo-600',
    bgHover: 'hover:bg-indigo-700',
    border: 'border-indigo-500 dark:border-indigo-400',
    ring: 'ring-indigo-500 focus:ring-indigo-500',
  },

  // Difficulty colors
  difficulty: {
    easy: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-500',
      light: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200',
    },
    medium: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-500',
      light: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200',
    },
    hard: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-500',
      light: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200',
    },
  },

  // Priority colors
  priority: {
    low: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200',
  },

  // Status colors
  status: {
    completed: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200',
    dueToday: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200',
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', // Added error status
  },

  // Background colors
  background: {
    primary: 'bg-gray-50 dark:bg-gray-900',
    secondary: 'bg-white dark:bg-gray-800',
    tertiary: 'bg-gray-50 dark:bg-gray-850',
    card: 'bg-white dark:bg-gray-800',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
  },

  // Text colors
  text: {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-600 dark:text-gray-300',
    tertiary: 'text-gray-500 dark:text-gray-400',
    muted: 'text-gray-400 dark:text-gray-500',
    inverse: 'text-white',
    error: 'text-red-600 dark:text-red-400',
    link: 'text-indigo-600 dark:text-indigo-400',
    linkHover: 'hover:text-indigo-700 dark:hover:text-indigo-300',
    headings: 'text-gray-900 dark:text-gray-100',
  },

  // Border colors
  border: {
    primary: 'border-gray-200 dark:border-gray-700',
    secondary: 'border-gray-300 dark:border-gray-600',
    input: 'border-gray-300 dark:border-gray-600',
    focus: 'focus:border-indigo-500 dark:focus:border-indigo-400',
  },

  // Button variants
  button: {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500',
    secondaryHover: 'hover:bg-gray-400 dark:hover:bg-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    ghost: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
  },

  // Tag colors
  tag: {
    default: {
      bg: 'bg-gray-100 dark:bg-gray-700',
      text: 'text-gray-700 dark:text-gray-300',
    },
  },

  // Input styles
  input: {
    base: 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
    focus: 'focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400',
  },

  // Chart colors (for the dashboard)
  chart: {
    easy: '#14B8A6',
    medium: '#F59E0B', 
    hard: '#EF4444',
  },

  // Action colors
  action: {
    edit: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
    delete: 'text-red-400 hover:text-red-600 dark:hover:text-red-300',
    complete: 'text-green-400 hover:text-green-600 dark:hover:text-green-300',
    external: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
  },
};

// Utility functions for getting colors
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return colors.difficulty.easy.light;
    case 'medium':
      return colors.difficulty.medium.light;
    case 'hard':
      return colors.difficulty.hard.light;
    default:
      return colors.text.secondary;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return colors.priority.high;
    case 'medium':
      return colors.priority.medium;
    case 'low':
      return colors.priority.low;
    default:
      return colors.priority.medium;
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return colors.status.completed;
    case 'overdue':
      return colors.status.overdue;
    case 'due-today':
    case 'duetoday':
      return colors.status.dueToday;
    case 'upcoming':
      return colors.status.upcoming;
    default:
      return colors.status.upcoming;
  }
};