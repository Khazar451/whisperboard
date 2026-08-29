// WhisperBoard — Anonymous Group Feedback on Midnight
// Feed-style layout with ambient radial background glow and layered depth

import React from 'react';
import { Box, Container } from '@mui/material';
import { Header, HeaderProps } from './Header';

export interface MainLayoutProps extends React.PropsWithChildren, HeaderProps {}

/**
 * Provides a centered, feed-style layout for WhisperBoard with ambient radial depth glow.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children, onJoinClick, knownContractsCount }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient Radial Glow behind the Active Compose Area */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '900px',
          height: '520px',
          background:
            'radial-gradient(ellipse 70% 320px at 50% 120px, rgba(139, 92, 246, 0.14), rgba(6, 182, 212, 0.05) 55%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Header onJoinClick={onJoinClick} knownContractsCount={knownContractsCount} />
      <Container
        maxWidth="sm"
        sx={{
          py: 4,
          px: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};
