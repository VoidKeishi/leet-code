// Material Design 3 (Material You) Color System
// Based on Google's Material Design 3 specification

// === CORE COLOR TOKENS ===
// These are the foundational colors that generate the entire color scheme

export const coreColors = {
  // Seed color - primary brand color that generates the entire palette
  seed: '#6750A4', // Purple-based seed color (Material You default)
  
  // Core palette colors (these would typically be generated from the seed)
  primary: {
    0: '#000000',
    4: '#0F0019',
    10: '#21005D',
    12: '#2A0066',
    17: '#36006F',
    20: '#381E72',
    22: '#3E2278',
    30: '#4F378B',
    40: '#6750A4',
    50: '#7F67BE',
    60: '#9A82DB',
    70: '#B69DF8',
    80: '#D0BCFF',
    90: '#EADDFF',
    92: '#EDE7FF',
    94: '#F1EBFF',
    95: '#F6EDFF',
    96: '#F8F0FF',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
  
  secondary: {
    0: '#000000',
    4: '#0A0713',
    10: '#1D192B',
    12: '#211D30',
    17: '#292336',
    20: '#332D41',
    22: '#372F44',
    30: '#4A4458',
    40: '#625B71',
    50: '#7A7289',
    60: '#958DA5',
    70: '#B0A7C0',
    80: '#CCC2DC',
    90: '#E8DEF8',
    92: '#ECE6F0',
    94: '#F1EBFF',
    95: '#F6EDFF',
    96: '#F8F0FF',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
  
  tertiary: {
    0: '#000000',
    4: '#0F0711',
    10: '#31111D',
    12: '#361520',
    17: '#3D1B26',
    20: '#492532',
    22: '#4E2935',
    30: '#633B48',
    40: '#7D5260',
    50: '#986977',
    60: '#B58392',
    70: '#D29DAC',
    80: '#EFB8C8',
    90: '#FFD8E4',
    92: '#FFE0EA',
    94: '#FFE7ED',
    95: '#FFECF1',
    96: '#FFF0F3',
    99: '#FFFBFA',
    100: '#FFFFFF',
  },
  
  neutral: {
    0: '#000000',
    4: '#0F0F11',
    10: '#1C1B1F',
    12: '#1F1E22',
    17: '#252428',
    20: '#313033',
    22: '#343236',
    30: '#484649',
    40: '#605D62',
    50: '#787579',
    60: '#939094',
    70: '#AEAAAE',
    80: '#CAC4D0',
    90: '#E6E0E9',
    92: '#EAE4ED',
    94: '#F0EAF4',
    95: '#F4EFF4',
    96: '#F6F1F7',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
  
  neutralVariant: {
    0: '#000000',
    4: '#0C0A12',
    10: '#1D1A22',
    12: '#201D25',
    17: '#26232B',
    20: '#322F37',
    22: '#35323A',
    30: '#49454F',
    40: '#605D66',
    50: '#79747E',
    60: '#938F99',
    70: '#AEA9B4',
    80: '#CAC4D0',
    90: '#E7E0EC',
    92: '#EBE4F0',
    94: '#F1EAF7',
    95: '#F5EEF7',
    96: '#F7F2F9',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
  
  error: {
    0: '#000000',
    4: '#1F0404',
    10: '#410E0B',
    12: '#4A1011',
    17: '#541216',
    20: '#601410',
    22: '#681518',
    30: '#8C1D18',
    40: '#B3261E',
    50: '#DC362E',
    60: '#E46962',
    70: '#EC928E',
    80: '#F2B8B5',
    90: '#F9DEDC',
    92: '#FAE2E0',
    94: '#FCE8E6',
    95: '#FCEEEE',
    96: '#FDF1F0',
    99: '#FFFBF9',
    100: '#FFFFFF',
  },
} as const;

// === SEMANTIC COLOR ROLES (Light Theme) ===
const lightTheme = {
  // Primary colors
  primary: `text-[${coreColors.primary[40]}]`,
  onPrimary: `text-[${coreColors.primary[100]}]`,
  primaryContainer: `bg-[${coreColors.primary[90]}]`,
  onPrimaryContainer: `text-[${coreColors.primary[10]}]`,
  
  // Secondary colors
  secondary: `text-[${coreColors.secondary[40]}]`,
  onSecondary: `text-[${coreColors.secondary[100]}]`,
  secondaryContainer: `bg-[${coreColors.secondary[90]}]`,
  onSecondaryContainer: `text-[${coreColors.secondary[10]}]`,
  
  // Tertiary colors
  tertiary: `text-[${coreColors.tertiary[40]}]`,
  onTertiary: `text-[${coreColors.tertiary[100]}]`,
  tertiaryContainer: `bg-[${coreColors.tertiary[90]}]`,
  onTertiaryContainer: `text-[${coreColors.tertiary[10]}]`,
  
  // Error colors
  error: `text-[${coreColors.error[40]}]`,
  onError: `text-[${coreColors.error[100]}]`,
  errorContainer: `bg-[${coreColors.error[90]}]`,
  onErrorContainer: `text-[${coreColors.error[10]}]`,
  
  // Surface colors
  surface: `bg-[${coreColors.neutral[99]}]`,
  onSurface: `text-[${coreColors.neutral[10]}]`,
  surfaceVariant: `bg-[${coreColors.neutralVariant[90]}]`,
  onSurfaceVariant: `text-[${coreColors.neutralVariant[30]}]`,
  
  // Surface containers
  surfaceContainerLowest: `bg-[${coreColors.neutral[100]}]`,
  surfaceContainerLow: `bg-[${coreColors.neutral[96]}]`,
  surfaceContainer: `bg-[${coreColors.neutral[94]}]`,
  surfaceContainerHigh: `bg-[${coreColors.neutral[92]}]`,
  surfaceContainerHighest: `bg-[${coreColors.neutral[90]}]`,
  
  // Outline colors
  outline: `border-[${coreColors.neutralVariant[50]}]`,
  outlineVariant: `border-[${coreColors.neutralVariant[80]}]`,
  
  // Other surface colors
  inverseSurface: `bg-[${coreColors.neutral[20]}]`,
  inverseOnSurface: `text-[${coreColors.neutral[95]}]`,
  inversePrimary: `text-[${coreColors.primary[80]}]`,
  
  // Backdrop
  scrim: `bg-[${coreColors.neutral[0]}]`,
  shadow: `shadow-[${coreColors.neutral[0]}]`,
} as const;

// === SEMANTIC COLOR ROLES (Dark Theme) ===
const darkTheme = {
  // Primary colors
  primary: `dark:text-[${coreColors.primary[80]}]`,
  onPrimary: `dark:text-[${coreColors.primary[20]}]`,
  primaryContainer: `dark:bg-[${coreColors.primary[30]}]`,
  onPrimaryContainer: `dark:text-[${coreColors.primary[90]}]`,
  
  // Secondary colors
  secondary: `dark:text-[${coreColors.secondary[80]}]`,
  onSecondary: `dark:text-[${coreColors.secondary[20]}]`,
  secondaryContainer: `dark:bg-[${coreColors.secondary[30]}]`,
  onSecondaryContainer: `dark:text-[${coreColors.secondary[90]}]`,
  
  // Tertiary colors
  tertiary: `dark:text-[${coreColors.tertiary[80]}]`,
  onTertiary: `dark:text-[${coreColors.tertiary[20]}]`,
  tertiaryContainer: `dark:bg-[${coreColors.tertiary[30]}]`,
  onTertiaryContainer: `dark:text-[${coreColors.tertiary[90]}]`,
  
  // Error colors
  error: `dark:text-[${coreColors.error[80]}]`,
  onError: `dark:text-[${coreColors.error[20]}]`,
  errorContainer: `dark:bg-[${coreColors.error[30]}]`,
  onErrorContainer: `dark:text-[${coreColors.error[90]}]`,
  
  // Surface colors
  surface: `dark:bg-[${coreColors.neutral[10]}]`,
  onSurface: `dark:text-[${coreColors.neutral[90]}]`,
  surfaceVariant: `dark:bg-[${coreColors.neutralVariant[30]}]`,
  onSurfaceVariant: `dark:text-[${coreColors.neutralVariant[80]}]`,
  
  // Surface containers
  surfaceContainerLowest: `dark:bg-[${coreColors.neutral[4]}]`,
  surfaceContainerLow: `dark:bg-[${coreColors.neutral[10]}]`,
  surfaceContainer: `dark:bg-[${coreColors.neutral[12]}]`,
  surfaceContainerHigh: `dark:bg-[${coreColors.neutral[17]}]`,
  surfaceContainerHighest: `dark:bg-[${coreColors.neutral[22]}]`,
  
  // Outline colors
  outline: `dark:border-[${coreColors.neutralVariant[60]}]`,
  outlineVariant: `dark:border-[${coreColors.neutralVariant[30]}]`,
  
  // Other surface colors
  inverseSurface: `dark:bg-[${coreColors.neutral[90]}]`,
  inverseOnSurface: `dark:text-[${coreColors.neutral[20]}]`,
  inversePrimary: `dark:text-[${coreColors.primary[40]}]`,
  
  // Backdrop
  scrim: `dark:bg-[${coreColors.neutral[0]}]`,
  shadow: `dark:shadow-[${coreColors.neutral[0]}]`,
} as const;

// === MATERIAL DESIGN 3 COLOR SYSTEM ===
export const materialColors = {
  // Primary color roles
  primary: {
    main: `${lightTheme.primary} ${darkTheme.primary}`,
    on: `${lightTheme.onPrimary} ${darkTheme.onPrimary}`,
    container: `${lightTheme.primaryContainer} ${darkTheme.primaryContainer}`,
    onContainer: `${lightTheme.onPrimaryContainer} ${darkTheme.onPrimaryContainer}`,
    // State layers
    hover: `hover:bg-[${coreColors.primary[40]}]/8 dark:hover:bg-[${coreColors.primary[80]}]/8`,
    focus: `focus:bg-[${coreColors.primary[40]}]/12 dark:focus:bg-[${coreColors.primary[80]}]/12`,
    pressed: `active:bg-[${coreColors.primary[40]}]/12 dark:active:bg-[${coreColors.primary[80]}]/12`,
    disabled: `disabled:bg-[${coreColors.neutral[90]}] dark:disabled:bg-[${coreColors.neutral[20]}]`,
  },
  
  // Secondary color roles
  secondary: {
    main: `${lightTheme.secondary} ${darkTheme.secondary}`,
    on: `${lightTheme.onSecondary} ${darkTheme.onSecondary}`,
    container: `${lightTheme.secondaryContainer} ${darkTheme.secondaryContainer}`,
    onContainer: `${lightTheme.onSecondaryContainer} ${darkTheme.onSecondaryContainer}`,
    hover: `hover:bg-[${coreColors.secondary[40]}]/8 dark:hover:bg-[${coreColors.secondary[80]}]/8`,
    focus: `focus:bg-[${coreColors.secondary[40]}]/12 dark:focus:bg-[${coreColors.secondary[80]}]/12`,
    pressed: `active:bg-[${coreColors.secondary[40]}]/12 dark:active:bg-[${coreColors.secondary[80]}]/12`,
  },
  
  // Tertiary color roles
  tertiary: {
    main: `${lightTheme.tertiary} ${darkTheme.tertiary}`,
    on: `${lightTheme.onTertiary} ${darkTheme.onTertiary}`,
    container: `${lightTheme.tertiaryContainer} ${darkTheme.tertiaryContainer}`,
    onContainer: `${lightTheme.onTertiaryContainer} ${darkTheme.onTertiaryContainer}`,
    hover: `hover:bg-[${coreColors.tertiary[40]}]/8 dark:hover:bg-[${coreColors.tertiary[80]}]/8`,
    focus: `focus:bg-[${coreColors.tertiary[40]}]/12 dark:focus:bg-[${coreColors.tertiary[80]}]/12`,
    pressed: `active:bg-[${coreColors.tertiary[40]}]/12 dark:active:bg-[${coreColors.tertiary[80]}]/12`,
  },
  
  // Error color roles
  error: {
    main: `${lightTheme.error} ${darkTheme.error}`,
    on: `${lightTheme.onError} ${darkTheme.onError}`,
    container: `${lightTheme.errorContainer} ${darkTheme.errorContainer}`,
    onContainer: `${lightTheme.onErrorContainer} ${darkTheme.onErrorContainer}`,
    hover: `hover:bg-[${coreColors.error[40]}]/8 dark:hover:bg-[${coreColors.error[80]}]/8`,
    focus: `focus:bg-[${coreColors.error[40]}]/12 dark:focus:bg-[${coreColors.error[80]}]/12`,
    pressed: `active:bg-[${coreColors.error[40]}]/12 dark:active:bg-[${coreColors.error[80]}]/12`,
  },
  
  // Surface color roles
  surface: {
    main: `${lightTheme.surface} ${darkTheme.surface}`,
    on: `${lightTheme.onSurface} ${darkTheme.onSurface}`,
    variant: `${lightTheme.surfaceVariant} ${darkTheme.surfaceVariant}`,
    onVariant: `${lightTheme.onSurfaceVariant} ${darkTheme.onSurfaceVariant}`,
    
    // Surface containers
    containerLowest: `${lightTheme.surfaceContainerLowest} ${darkTheme.surfaceContainerLowest}`,
    containerLow: `${lightTheme.surfaceContainerLow} ${darkTheme.surfaceContainerLow}`,
    container: `${lightTheme.surfaceContainer} ${darkTheme.surfaceContainer}`,
    containerHigh: `${lightTheme.surfaceContainerHigh} ${darkTheme.surfaceContainerHigh}`,
    containerHighest: `${lightTheme.surfaceContainerHighest} ${darkTheme.surfaceContainerHighest}`,
    
    // Surface state layers
    hover: `hover:bg-[${coreColors.neutral[10]}]/8 dark:hover:bg-[${coreColors.neutral[90]}]/8`,
    focus: `focus:bg-[${coreColors.neutral[10]}]/12 dark:focus:bg-[${coreColors.neutral[90]}]/12`,
    pressed: `active:bg-[${coreColors.neutral[10]}]/12 dark:active:bg-[${coreColors.neutral[90]}]/12`,
  },
  
  // Outline colors
  outline: {
    main: `${lightTheme.outline} ${darkTheme.outline}`,
    variant: `${lightTheme.outlineVariant} ${darkTheme.outlineVariant}`,
  },
  
  // Special surface colors
  inverse: {
    surface: `${lightTheme.inverseSurface} ${darkTheme.inverseSurface}`,
    onSurface: `${lightTheme.inverseOnSurface} ${darkTheme.inverseOnSurface}`,
    primary: `${lightTheme.inversePrimary} ${darkTheme.inversePrimary}`,
  },
  
  // Backdrop colors
  scrim: `${lightTheme.scrim} ${darkTheme.scrim}`,
  shadow: `${lightTheme.shadow} ${darkTheme.shadow}`,
} as const;

// === ENHANCED COMPONENT-SPECIFIC COLORS ===
export const components = {
  // Button variants following Material Design 3
  button: {
    filled: {
      bg: `bg-[${coreColors.primary[40]}] dark:bg-[${coreColors.primary[80]}]`,
      text: `text-[${coreColors.primary[100]}] dark:text-[${coreColors.primary[20]}]`,
      hover: `hover:bg-[${coreColors.primary[30]}] dark:hover:bg-[${coreColors.primary[70]}]`,
      focus: `focus:ring-2 focus:ring-[${coreColors.primary[40]}] dark:focus:ring-[${coreColors.primary[80]}]`,
      disabled: `disabled:bg-[${coreColors.neutral[90]}] dark:disabled:bg-[${coreColors.neutral[20]}] disabled:text-[${coreColors.neutral[40]}] dark:disabled:text-[${coreColors.neutral[60]}]`,
    },
    filledTonal: {
      bg: `bg-[${coreColors.primary[90]}] dark:bg-[${coreColors.primary[30]}]`,
      text: `text-[${coreColors.primary[10]}] dark:text-[${coreColors.primary[90]}]`,
      hover: `hover:bg-[${coreColors.primary[80]}] dark:hover:bg-[${coreColors.primary[40]}]`,
      focus: `focus:ring-2 focus:ring-[${coreColors.primary[90]}] dark:focus:ring-[${coreColors.primary[30]}]`,
    },
    outlined: {
      bg: `bg-transparent`,
      text: `text-[${coreColors.primary[40]}] dark:text-[${coreColors.primary[80]}]`,
      border: `border border-[${coreColors.neutral[50]}] dark:border-[${coreColors.neutral[60]}]`,
      hover: `hover:bg-[${coreColors.primary[40]}]/8 dark:hover:bg-[${coreColors.primary[80]}]/8`,
      focus: `focus:ring-2 focus:ring-[${coreColors.primary[40]}] dark:focus:ring-[${coreColors.primary[80]}]`,
    },
    text: {
      bg: `bg-transparent`,
      text: `text-[${coreColors.primary[40]}] dark:text-[${coreColors.primary[80]}]`,
      hover: `hover:bg-[${coreColors.primary[40]}]/8 dark:hover:bg-[${coreColors.primary[80]}]/8`,
      focus: `focus:ring-2 focus:ring-[${coreColors.primary[40]}] dark:focus:ring-[${coreColors.primary[80]}]`,
    },
  },
  
  // Card variants
  card: {
    elevated: `bg-[${coreColors.neutral[99]}] dark:bg-[${coreColors.neutral[12]}] shadow-md`,
    filled: `bg-[${coreColors.neutral[94]}] dark:bg-[${coreColors.neutral[17]}]`,
    outlined: `bg-[${coreColors.neutral[99]}] dark:bg-[${coreColors.neutral[10]}] border border-[${coreColors.neutralVariant[80]}] dark:border-[${coreColors.neutralVariant[30]}]`,
  },
  
  // Input variants
  input: {
    filled: {
      bg: `bg-[${coreColors.neutral[94]}] dark:bg-[${coreColors.neutral[17]}]`,
      text: `text-[${coreColors.neutral[10]}] dark:text-[${coreColors.neutral[90]}]`,
      border: `border-b-2 border-[${coreColors.neutralVariant[50]}] dark:border-[${coreColors.neutralVariant[60]}]`,
      focus: `focus:border-[${coreColors.primary[40]}] dark:focus:border-[${coreColors.primary[80]}]`,
      placeholder: `placeholder-[${coreColors.neutralVariant[30]}] dark:placeholder-[${coreColors.neutralVariant[80]}]`,
    },
    outlined: {
      bg: `bg-transparent`,
      text: `text-[${coreColors.neutral[10]}] dark:text-[${coreColors.neutral[90]}]`,
      border: `border border-[${coreColors.neutralVariant[50]}] dark:border-[${coreColors.neutralVariant[60]}]`,
      focus: `focus:border-2 focus:border-[${coreColors.primary[40]}] dark:focus:border-[${coreColors.primary[80]}]`,
      placeholder: `placeholder-[${coreColors.neutralVariant[30]}] dark:placeholder-[${coreColors.neutralVariant[80]}]`,
    },
  },
} as const;

// === ENHANCED DIFFICULTY COLORS (Material Design 3 approach) ===
export const difficulty = {
  easy: {
    main: `text-green-600 dark:text-green-400`,
    container: `bg-green-100 dark:bg-green-900/30`,
    onContainer: `text-green-800 dark:text-green-200`,
    surface: `bg-green-50 dark:bg-green-950/50`,
  },
  medium: {
    main: `text-yellow-600 dark:text-yellow-400`,
    container: `bg-yellow-100 dark:bg-yellow-900/30`,
    onContainer: `text-yellow-800 dark:text-yellow-200`,
    surface: `bg-yellow-50 dark:bg-yellow-950/50`,
  },
  hard: {
    main: `text-red-600 dark:text-red-400`,
    container: `bg-red-100 dark:bg-red-900/30`,
    onContainer: `text-red-800 dark:text-red-200`,
    surface: `bg-red-50 dark:bg-red-950/50`,
  },
} as const;

// === BACKWARD COMPATIBILITY LAYER ===
// This maintains compatibility with your existing code while providing the new MD3 system
export const colors = {
  // Legacy support - maps to new MD3 system
  primary: {
    50: materialColors.primary.container,
    100: materialColors.primary.container,
    500: materialColors.primary.main,
    600: materialColors.primary.main,
    700: materialColors.primary.main,
    text: materialColors.primary.main,
    textHover: materialColors.primary.hover,
    bg: materialColors.primary.main,
    bgHover: materialColors.primary.hover,
    border: materialColors.outline.main,
    ring: materialColors.primary.focus,
  },

  // Enhanced difficulty colors
  difficulty: {
    easy: {
      bg: difficulty.easy.container,
      text: difficulty.easy.main,
      border: `border-green-500`,
      light: difficulty.easy.onContainer,
    },
    medium: {
      bg: difficulty.medium.container,
      text: difficulty.medium.main,
      border: `border-yellow-500`,
      light: difficulty.medium.onContainer,
    },
    hard: {
      bg: difficulty.hard.container,
      text: difficulty.hard.main,
      border: `border-red-500`,
      light: difficulty.hard.onContainer,
    },
  },

  // Status colors mapped to MD3
  status: {
    completed: difficulty.easy.onContainer,
    overdue: difficulty.hard.onContainer,
    dueToday: difficulty.medium.onContainer,
    upcoming: `bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200`,
    error: materialColors.error.container,
  },

  // Background using MD3 surface system
  background: {
    primary: materialColors.surface.main,
    secondary: materialColors.surface.containerLow,
    tertiary: materialColors.surface.container,
    card: materialColors.surface.containerHigh,
    hover: materialColors.surface.hover,
  },

  // Text using MD3 semantic roles
  text: {
    primary: materialColors.surface.on,
    secondary: materialColors.surface.onVariant,
    tertiary: materialColors.surface.onVariant,
    muted: materialColors.surface.onVariant,
    inverse: materialColors.inverse.onSurface,
    error: materialColors.error.main,
    link: materialColors.primary.main,
    linkHover: materialColors.primary.hover,
    headings: materialColors.surface.on,
  },

  // Border using MD3 outline system
  border: {
    primary: materialColors.outline.variant,
    secondary: materialColors.outline.main,
    input: materialColors.outline.variant,
    focus: materialColors.primary.focus,
  },

  // Enhanced buttons using MD3 button system
  button: {
    primary: `${components.button.filled.bg} ${components.button.filled.text} ${components.button.filled.hover} ${components.button.filled.focus}`,
    secondary: `${components.button.filledTonal.bg} ${components.button.filledTonal.text} ${components.button.filledTonal.hover}`,
    danger: `bg-[${coreColors.error[40]}] text-[${coreColors.error[100]}] hover:bg-[${coreColors.error[30]}] dark:bg-[${coreColors.error[80]}] dark:text-[${coreColors.error[20]}] dark:hover:bg-[${coreColors.error[70]}]`,
    success: `bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600`,
    ghost: `${components.button.text.bg} ${components.button.text.text} ${components.button.text.hover}`,
  },

  // Input using MD3 input system
  input: {
    base: `${components.input.filled.bg} ${components.input.filled.text} ${components.input.filled.border} ${components.input.filled.placeholder}`,
    focus: components.input.filled.focus,
  },

  // Action colors
  action: {
    edit: materialColors.surface.onVariant,
    delete: materialColors.error.main,
    complete: difficulty.easy.main,
    external: materialColors.surface.onVariant,
  },

  // Chart colors (enhanced with MD3 approach)
  chart: {
    easy: coreColors.primary[60],
    medium: coreColors.tertiary[50],
    hard: coreColors.error[50],
  },

  // Legacy support
  priority: {
    low: difficulty.easy.onContainer,
    medium: difficulty.medium.onContainer,
    high: difficulty.hard.onContainer,
  },

  tag: {
    default: {
      bg: materialColors.surface.containerHigh,
      text: materialColors.surface.on,
    },
  },
} as const;

// === UTILITY FUNCTIONS (Enhanced for MD3) ===
export const getDifficultyColor = (difficultyLevel: string) => {
  switch (difficultyLevel.toLowerCase()) {
    case 'easy':
      return difficulty.easy.onContainer;
    case 'medium':
      return difficulty.medium.onContainer;
    case 'hard':
      return difficulty.hard.onContainer;
    default:
      return materialColors.surface.onVariant;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return difficulty.hard.onContainer;
    case 'medium':
      return difficulty.medium.onContainer;
    case 'low':
      return difficulty.easy.onContainer;
    default:
      return difficulty.medium.onContainer;
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return difficulty.easy.onContainer;
    case 'overdue':
      return difficulty.hard.onContainer;
    case 'due-today':
    case 'duetoday':
      return difficulty.medium.onContainer;
    case 'upcoming':
      return `bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200`;
    default:
      return `bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200`;
  }
};

// === MATERIAL DESIGN 3 UTILITY FUNCTIONS ===
export const getMaterialColor = (role: string, variant?: string) => {
  const colorPath = role.split('.');
  let color: any = materialColors;
  
  for (const path of colorPath) {
    color = color[path];
    if (!color) return '';
  }
  
  if (variant && typeof color === 'object' && color[variant]) {
    return color[variant];
  }
  
  return typeof color === 'string' ? color : (color?.main || '');
};

export const getComponentColor = (component: keyof typeof components, variant: string) => {
  const comp = components[component];
  if (!comp || typeof comp !== 'object') return '';
  
  const variantColor = (comp as any)[variant];
  return typeof variantColor === 'string' ? variantColor : '';
};

// Export light and dark themes separately for external use
export { lightTheme, darkTheme };