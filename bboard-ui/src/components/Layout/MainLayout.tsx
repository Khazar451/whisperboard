// WhisperBoard — Anonymous Group Feedback on Midnight
// Feed-style vertical layout with header actions

import React from 'react';
import { Box, Container } from '@mui/material';
import { Header, HeaderProps } from './Header';

export interface MainLayoutProps extends React.PropsWithChildren, HeaderProps {}

/**
 * Provides a centered, feed-style layout for WhisperBoard.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children, onJoinClick, knownContractsCount }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onJoinClick={onJoinClick} knownContractsCount={knownContractsCount} />
      <Container
        maxWidth="sm"
        sx={{
          py: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Container>
    </Box>
  );
};
