// WhisperBoard — Anonymous Group Feedback on Midnight
// Rebranded header with privacy tagline and feed utilities

import React, { useState } from 'react';
import { AppBar, Box, Typography, Chip, Button, Snackbar, Alert, Tooltip, IconButton } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import AddLinkIcon from '@mui/icons-material/AddLink';

export interface HeaderProps {
  onJoinClick?: () => void;
  knownContractsCount?: number;
}

/**
 * WhisperBoard application header with branding, privacy badge, and feed sharing actions.
 */
export const Header: React.FC<HeaderProps> = ({ onJoinClick, knownContractsCount = 0 }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleShareFeed = async () => {
    try {
      const saved = localStorage.getItem('whisperboard_known_contracts');
      const addrs: string[] = saved ? JSON.parse(saved) : [];
      const url = new URL(window.location.href);
      if (addrs.length > 0) {
        url.searchParams.set('boards', addrs.join(','));
      }
      await navigator.clipboard.writeText(url.toString());
      setSnackbarOpen(true);
    } catch (e) {
      console.error('Failed to copy feed link:', e);
    }
  };

  return (
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
        px: { xs: 2, md: 4 },
        py: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {onJoinClick && (
          <Tooltip title="Import or join an existing contract address">
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<AddLinkIcon />}
              onClick={onJoinClick}
              sx={{
                borderColor: 'divider',
                color: 'text.secondary',
                fontSize: '0.8rem',
                display: { xs: 'none', sm: 'inline-flex' },
              }}
            >
              Join Contract
            </Button>
          </Tooltip>
        )}

        {knownContractsCount > 0 && (
          <Tooltip title="Copy link to this feed (with all post addresses)">
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<ShareIcon />}
              onClick={handleShareFeed}
              sx={{ fontSize: '0.8rem' }}
            >
              Share Feed
            </Button>
          </Tooltip>
        )}

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
            display: { xs: 'none', md: 'inline-flex' },
          }}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Feed link copied to clipboard! Share it with anyone.
        </Alert>
      </Snackbar>
    </AppBar>
  );
};
