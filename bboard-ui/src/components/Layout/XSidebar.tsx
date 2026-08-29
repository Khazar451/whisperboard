// WhisperBoard — Left Navigation Sidebar (X / Twitter Style)

import React from 'react';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface XSidebarProps {
  onJoinClick?: () => void;
  onComposeClick?: () => void;
}

export const XSidebar: React.FC<XSidebarProps> = ({ onJoinClick, onComposeClick }) => {
  return (
    <Box
      sx={{
        width: { xs: 68, xl: 275 },
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        px: { xs: 1, xl: 2 },
        py: 1.5,
        borderRight: '1px solid #2f3336',
        flexShrink: 0,
      }}
    >
      {/* Top section: Logo + Nav */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.2,
            borderRadius: 9999,
            cursor: 'pointer',
            width: 'fit-content',
            '&:hover': { bgcolor: 'rgba(231, 233, 234, 0.1)' },
          }}
        >
          {/* Custom Minimalist Whisper Logo */}
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              bgcolor: '#e7e9ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              fontWeight: 900,
              fontSize: '1.2rem',
            }}
          >
            W
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1.25rem',
              color: '#e7e9ea',
              display: { xs: 'none', xl: 'block' },
              letterSpacing: '-0.03em',
            }}
          >
            Whisper
          </Typography>
        </Box>

        {/* Nav Items */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
          {/* Home Nav */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 1.4,
              borderRadius: 9999,
              cursor: 'pointer',
              bgcolor: 'transparent',
              color: '#e7e9ea',
              '&:hover': { bgcolor: 'rgba(231, 233, 234, 0.1)' },
              width: { xs: 'fit-content', xl: 'auto' },
            }}
          >
            <HomeIcon sx={{ fontSize: 28 }} />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.25rem',
                display: { xs: 'none', xl: 'block' },
                letterSpacing: '-0.01em',
              }}
            >
              Home
            </Typography>
          </Box>

          {/* Shielded Feed Nav */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 1.4,
              borderRadius: 9999,
              cursor: 'pointer',
              color: '#e7e9ea',
              '&:hover': { bgcolor: 'rgba(231, 233, 234, 0.1)' },
              width: { xs: 'fit-content', xl: 'auto' },
            }}
          >
            <ShieldIcon sx={{ fontSize: 28 }} />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '1.25rem',
                display: { xs: 'none', xl: 'block' },
                letterSpacing: '-0.01em',
              }}
            >
              Shielded
            </Typography>
          </Box>

          {/* Midnight Network Nav */}
          <Box
            component="a"
            href="https://docs.midnight.network"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 1.4,
              borderRadius: 9999,
              cursor: 'pointer',
              color: '#e7e9ea',
              textDecoration: 'none',
              '&:hover': { bgcolor: 'rgba(231, 233, 234, 0.1)' },
              width: { xs: 'fit-content', xl: 'auto' },
            }}
          >
            <LanguageIcon sx={{ fontSize: 28 }} />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '1.25rem',
                display: { xs: 'none', xl: 'block' },
                letterSpacing: '-0.01em',
              }}
            >
              Midnight
            </Typography>
          </Box>

          {/* Join Contract Nav */}
          {onJoinClick && (
            <Box
              onClick={onJoinClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 2,
                py: 1.4,
                borderRadius: 9999,
                cursor: 'pointer',
                color: '#e7e9ea',
                '&:hover': { bgcolor: 'rgba(231, 233, 234, 0.1)' },
                width: { xs: 'fit-content', xl: 'auto' },
              }}
            >
              <AddLinkIcon sx={{ fontSize: 28 }} />
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '1.25rem',
                  display: { xs: 'none', xl: 'block' },
                  letterSpacing: '-0.01em',
                }}
              >
                Join Contract
              </Typography>
            </Box>
          )}
        </Box>

        {/* Big Post Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={onComposeClick}
          sx={{
            mt: 2,
            py: 1.5,
            width: { xs: 'auto', xl: '90%' },
            minWidth: { xs: 48, xl: 200 },
            borderRadius: 9999,
            fontSize: '1.05rem',
            fontWeight: 800,
          }}
        >
          <Typography sx={{ display: { xs: 'none', xl: 'block' }, fontWeight: 800 }}>
            Whisper
          </Typography>
          <LockOutlinedIcon sx={{ display: { xs: 'block', xl: 'none' } }} />
        </Button>
      </Box>

      {/* Bottom section: Prover Status + User Pill */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 1 }}>
        {/* Prover Status */}
        <Tooltip title="Local ZK-SNARK Prover is active on port 6300">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              px: { xs: 1, xl: 1.5 },
              py: 0.8,
              borderRadius: 9999,
              bgcolor: 'rgba(0, 186, 124, 0.1)',
              border: '1px solid rgba(0, 186, 124, 0.3)',
              cursor: 'default',
              width: 'fit-content',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#00ba7c',
                animation: 'pulseGlow 2s infinite',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                color: '#00ba7c',
                fontSize: '0.75rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                display: { xs: 'none', xl: 'block' },
                whiteSpace: 'nowrap',
              }}
            >
              Prover :6300 Active
            </Typography>
          </Box>
        </Tooltip>

        {/* User Pill */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            borderRadius: 9999,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(231, 233, 234, 0.1)' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                bgcolor: '#2f3336',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1d9bf0',
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ display: { xs: 'none', xl: 'block' }, lineHeight: 1.2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#e7e9ea' }}>
                Anon User
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#71767b' }}>
                @shielded · ZK
              </Typography>
            </Box>
          </Box>
          <MoreHorizIcon sx={{ color: '#71767b', display: { xs: 'none', xl: 'block' } }} />
        </Box>
      </Box>
    </Box>
  );
};
