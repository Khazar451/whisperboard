// WhisperBoard — Anonymous Group Feedback on Midnight
// Rebranded header with privacy tagline

import React from 'react';
import { AppBar, Box, Typography, Chip } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';

/**
 * WhisperBoard application header with branding and privacy badge.
 */
export const Header: React.FC = () => (
  <AppBar
    position="static"
    data-testid="header"
    sx={{
      backgroundColor: '#090a0f',
      borderBottom: '1px solid',
      borderColor: 'divider',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'none',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        px: { xs: 2, md: 4 },
        py: 1.5,
        alignItems: 'center',
        gap: 2,
      }}
      data-testid="header-logo"
    >
      <Typography
        variant="h6"
        sx={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          fontSize: '1.4rem',
        }}
      >
        WhisperBoard
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontStyle: 'italic',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        Speak freely. Stay anonymous.
      </Typography>
    </Box>
    <Box sx={{ px: { xs: 2, md: 4 } }}>
      <Chip
        icon={<ShieldIcon sx={{ fontSize: 16 }} />}
        label="Powered by Midnight"
        size="small"
        variant="outlined"
        sx={{
          borderColor: 'primary.dark',
          color: 'text.secondary',
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          '& .MuiChip-icon': { color: 'primary.main' },
        }}
      />
    </Box>
  </AppBar>
);
