import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------
// UPDATED COLORS
export const grey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F3F4F6',
  300: '#E5E7EB',
  400: '#D1D5DB',
  500: '#9CA3AF',
  600: '#6B7280',
  700: '#4B5563',
  800: '#374151',
  900: '#1F2937',
};

export const primary = {
  lighter: '#D1E8E4',
  light: '#76B7B2',
  main: '#2A7F7E', // Darker green for a soothing effect
  dark: '#1A5A5A',
  darker: '#0D3A3A',
  contrastText: '#FFFFFF',
};

export const secondary = {
  lighter: '#D1D8E8',
  light: '#7687B7',
  main: '#2A4F7E', // Deep blue for contrast
  dark: '#1A365A',
  darker: '#0D1F3A',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#E8F5E9',
  light: '#A5D6A7',
  main: '#2A7F7E', // Use your primary color - matches your theme
  dark: '#1A5A5A',
  darker: '#0D3A3A',
  contrastText: '#FFFFFF',
};

export const info = {
  lighter: '#D1D8E8',
  light: '#7687B7', 
  main: '#2A4F7E', // Use your secondary color
  dark: '#1A365A',
  darker: '#0D1F3A',
  contrastText: '#FFFFFF',
};

export const warning = {
  lighter: '#FFF8E1',
  light: '#FFECB3',
  main: '#FFC107', // Vibrant yellow for attention
  dark: '#FFA000',
  darker: '#FF6F00',
  contrastText: grey[800],
};

export const error = {
  lighter: '#FFEBEE',
  light: '#EF9A9A',
  main: '#E57373', // Softer red for alerts
  dark: '#D32F2F',
  darker: '#B71C1C',
  contrastText: '#FFFFFF',
};

export const common = {
  black: '#000000',
  white: '#FFFFFF',
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

// ----------------------------------------------------------------------

export function palette() {
  return {
    ...base,
    mode: 'light',
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: '#FFFFFF',
      default: '#F9FAFB',
      neutral: '#F3F4F6',
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  };
}