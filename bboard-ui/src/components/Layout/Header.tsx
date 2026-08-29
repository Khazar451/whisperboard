// WhisperBoard — Top Feed Header (X / Twitter Style)

import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Snackbar, Alert, Button } from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import AddLinkIcon from '@mui/icons-material/AddLink';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export interface HeaderProps {
  onJoinClick?: () => void;
  knownContractsCount?: number;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onJoinClick,
  knownContractsCount = 0,
  activeTab = 'for_you',
  onTabChange,
}) => {
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
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        bgcolor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2f3336',
      }}
    >
      {/* Top row with Title and actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.25rem',
            color: '#e7e9ea',
            letterSpacing: '-0.02em',
          }}
        >
          Home
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onJoinClick && (
            <Tooltip title="Import or join a contract address">
              <IconButton
                onClick={onJoinClick}
                size="small"
                sx={{
                  color: '#e7e9ea',
                  '&:hover': { bgcolor: 'rgba(231, 233, 234, 0.1)' },
                }}
              >
                <AddLinkIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}

          {knownContractsCount > 0 && (
            <Tooltip title="Share current feed link">
              <IconButton
                onClick={handleShareFeed}
                size="small"
                sx={{
                  color: '#1d9bf0',
                  '&:hover': { bgcolor: 'rgba(29, 155, 240, 0.1)' },
                }}
              >
                <ShareOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Twitter Tabs: "For you" / "Shielded Feed" */}
      <Box sx={{ display: 'flex', borderTop: '1px solid #2f3336' }}>
        <Box
          onClick={() => onTabChange?.('for_you')}
          sx={{
            flex: 1,
            py: 1.6,
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            '&:hover': { bgcolor: 'rgba(231, 233, 234, 0.05)' },
          }}
        >
          <Typography
            sx={{
              fontWeight: activeTab === 'for_you' ? 700 : 500,
              color: activeTab === 'for_you' ? '#e7e9ea' : '#71767b',
              fontSize: '0.9375rem',
            }}
          >
            For you
          </Typography>
          {activeTab === 'for_you' && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 56,
                height: 4,
                bgcolor: '#1d9bf0',
                borderRadius: 9999,
              }}
            />
          )}
        </Box>

        <Box
          onClick={() => onTabChange?.('shielded')}
          sx={{
            flex: 1,
            py: 1.6,
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            '&:hover': { bgcolor: 'rgba(231, 233, 234, 0.05)' },
          }}
        >
          <Typography
            sx={{
              fontWeight: activeTab === 'shielded' ? 700 : 500,
              color: activeTab === 'shielded' ? '#e7e9ea' : '#71767b',
              fontSize: '0.9375rem',
            }}
          >
            Shielded Feed
          </Typography>
          {activeTab === 'shielded' && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 72,
                height: 4,
                bgcolor: '#1d9bf0',
                borderRadius: 9999,
              }}
            />
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          icon={<CheckCircleIcon fontSize="inherit" />}
          sx={{
            bgcolor: '#16181c',
            color: '#e7e9ea',
            border: '1px solid #2f3336',
          }}
        >
          Feed link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};
