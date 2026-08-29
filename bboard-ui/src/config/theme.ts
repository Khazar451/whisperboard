// WhisperBoard — Authentic X / Twitter Dark Theme
// Clean, pitch-black (#000000), crisp hairline borders (#2f3336), and proportional typography

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#000000',
    },
    primary: {
      main: '#1d9bf0', // X Blue
      light: '#71c9f8',
      dark: '#1a8cd8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6', // Midnight Violet
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    success: {
      main: '#00ba7c', // X Green
      light: '#34d399',
    },
    error: {
      main: '#f4212e', // X Red / Danger
      light: '#fb7185',
    },
    text: {
      primary: '#e7e9ea', // Crisp off-white
      secondary: '#71767b', // Muted X gray
    },
    divider: '#2f3336', // X Hairline border
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h5: {
      fontWeight: 800,
      fontSize: '1.25rem',
      letterSpacing: '-0.02em',
      color: '#e7e9ea',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.1rem',
      letterSpacing: '-0.02em',
      color: '#e7e9ea',
    },
    subtitle1: {
      fontWeight: 700,
      fontSize: '0.9375rem',
      color: '#e7e9ea',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      color: '#71767b',
    },
    body1: {
      fontSize: '0.9375rem', // 15px
      lineHeight: 1.5,
      color: '#e7e9ea',
    },
    body2: {
      fontSize: '0.8125rem', // 13px
      lineHeight: 1.4,
      color: '#71767b',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#71767b',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @keyframes pulseGlow {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        body {
          background-color: #000000;
          color: #e7e9ea;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          scrollbar-width: thin;
          scrollbar-color: #2f3336 #000000;
          overflow-y: scroll;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000000;
        }
        ::-webkit-scrollbar-thumb {
          background: #2f3336;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3e4448;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 9999, // Pill shape
          letterSpacing: '-0.01em',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#1d9bf0',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1a8cd8',
          },
          '&.Mui-disabled': {
            backgroundColor: '#1d9bf0',
            opacity: 0.5,
            color: '#ffffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#000000',
          border: 'none',
          borderRadius: 0,
        },
      },
    },
  },
});
