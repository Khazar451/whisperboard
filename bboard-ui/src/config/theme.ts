// WhisperBoard — Anonymous Group Feedback on Midnight
// Refined Dark Privacy theme with Glassmorphism, Depth, and Modern Typography

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d0e15',
      paper: '#151722',
    },
    primary: {
      main: '#8b5cf6', // Violet
      light: '#a78bfa',
      dark: '#6d28d9',
    },
    secondary: {
      main: '#06b6d4', // Cyan
      light: '#22d3ee',
      dark: '#0891b2',
    },
    success: {
      main: '#10b981', // Emerald
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#f43f5e', // Rose
      light: '#fb7185',
      dark: '#e11d48',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.04em',
    },
    h5: {
      fontWeight: 800,
      letterSpacing: '-0.035em',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    subtitle2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '0.9375rem', // 15px
      lineHeight: 1.65,
      letterSpacing: '-0.005em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '-0.005em',
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes shimmerGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        body {
          background-color: #0d0e15;
          background-image: 
            radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.06) 0px, transparent 50%);
          background-attachment: fixed;
          scrollbar-width: thin;
          scrollbar-color: #1e2235 #0d0e15;
          margin: 0;
          color: #f8fafc;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0d0e15;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e2235;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #2d334d;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          letterSpacing: '-0.01em',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9333ea 0%, #6d28d9 100%)',
            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#151722',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1e2235',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#f8fafc',
          fontSize: '0.75rem',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        },
      },
    },
  },
});
