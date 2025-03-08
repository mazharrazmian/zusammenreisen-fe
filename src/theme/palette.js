import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------
// SETUP COLORS
export const grey = {
  0: '#FFFFFF',
  100: '#F8FAFC',
  200: '#EEF2F6',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#1E2A38',
  900: '#0D1721',
};

export const primary = {
  lighter: '#D1F0EE',
  light: '#64D2CE',
  main: '#06B6AE', // Turquoise - ocean/tropical vibe
  dark: '#038780',
  darker: '#025E59',
  contrastText: '#FFFFFF',
};

export const secondary = {
  lighter: '#FFF8E0',
  light: '#FFE08A',
  main: '#FFB800', // Warm amber/golden - sunset vibe
  dark: '#CC8A00',
  darker: '#9C6000',
  contrastText: '#1E2A38',
};

export const info = {
  lighter: '#D7E9FF',
  light: '#74ADFF',
  main: '#2979FF', // Bright blue - clear sky
  dark: '#144EAD',
  darker: '#0A2E71',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#E0F5D7',
  light: '#8AD168',
  main: '#4CAF50', // Fresh green - nature/eco travel
  dark: '#2D7A32',
  darker: '#15501B',
  contrastText: '#FFFFFF',
};

export const warning = {
  lighter: '#FFF4D7',
  light: '#FFD175',
  main: '#FF9800', // Vibrant orange - adventure/energy
  dark: '#C26C00',
  darker: '#874A00',
  contrastText: grey[800],
};

export const error = {
  lighter: '#FEE4D8',
  light: '#FF8A7E',
  main: '#F44336', // Coral red - alerts/important notices
  dark: '#C92919',
  darker: '#8E130A',
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
      default: '#F8FAFC',
      neutral: '#EEF2F6',
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  };
}