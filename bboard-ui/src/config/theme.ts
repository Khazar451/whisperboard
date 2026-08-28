// WhisperBoard — Anonymous Group Feedback on Midnight
// Dark privacy-themed aesthetic

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#090a0f',
      paper: '#11131f',
    },
    primary: {
      main: '#8b5cf6', // Violet
      light: '#a78bfa',
      dark: '#6d28d9',
    },
    secondary: {
      main: '#06b6d4', // Cyan
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#991b1b',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
    divider: '#1f2438',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    subtitle2: {
      fontWeight: 600,
    },
    caption: {
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#090a0f',
          scrollbarWidth: 'thin',
          scrollbarColor: '#1f2438 #090a0f',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
