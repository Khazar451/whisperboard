// WhisperBoard — Right Rail Widgets (X / Twitter Style)

import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShieldIcon from '@mui/icons-material/Shield';

export const XRightRail: React.FC = () => {
  return (
    <Box
      sx={{
        width: 350,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        gap: 2,
        px: 3,
        py: 1.5,
        borderLeft: '1px solid #2f3336',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search whispers..."
        variant="standard"
        slotProps={{
          input: {
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#71767b', fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: '#202327',
              borderRadius: 9999,
              px: 2,
              py: 1,
              color: '#e7e9ea',
              fontSize: '0.9375rem',
              border: '1px solid transparent',
              '&:focus-within': {
                bgcolor: '#000000',
                border: '1px solid #1d9bf0',
              },
            },
          },
        }}
      />

      {/* Network Live Card */}
      <Box
        sx={{
          bgcolor: '#16181c',
          borderRadius: 4,
          p: 2,
          border: '1px solid #2f3336',
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#e7e9ea', mb: 1.5 }}>
          Midnight Network
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
          {/* Trend 1 */}
          <Box sx={{ cursor: 'pointer', '&:hover opacity': 0.8 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#71767b' }}>
              Network Layer · Live
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#e7e9ea' }}>
              Midnight Preprod &amp; Mainnet
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#71767b' }}>
              tNIGHT &amp; tDUST Dual-Token
            </Typography>
          </Box>

          {/* Trend 2 */}
          <Box sx={{ cursor: 'pointer', '&:hover opacity': 0.8 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#71767b' }}>
              Privacy Tech · Active
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#e7e9ea' }}>
              Local ZK-SNARK Prover
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#71767b' }}>
              Proof server on :6300
            </Typography>
          </Box>

          {/* Trend 3 */}
          <Box sx={{ cursor: 'pointer', '&:hover opacity': 0.8 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#71767b' }}>
              Smart Contracts · Compiled
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#e7e9ea' }}>
              Compact DSL Circuits
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#71767b' }}>
              `post` &amp; `takeDown` ZK circuits
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Zero-Knowledge Protocol Card */}
      <Box
        sx={{
          bgcolor: '#16181c',
          borderRadius: 4,
          p: 2,
          border: '1px solid #2f3336',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ShieldIcon sx={{ color: '#1d9bf0', fontSize: 20 }} />
          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#e7e9ea' }}>
            Zero-Knowledge Guarantee
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.84rem', color: '#71767b', lineHeight: 1.5 }}>
          Your secret key never leaves your local browser. All proofs are compiled inside local Docker before being submitted to the Midnight ledger.
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#71767b', lineHeight: 1.6 }}>
          Terms of Service · Privacy Policy · Cookie Policy · Accessibility · Ads info · © 2026 WhisperBoard (MLH × Midnight)
        </Typography>
      </Box>
    </Box>
  );
};
