// WhisperBoard — Anonymous Group Feedback on Midnight
// Feed-style vertical layout replacing the card grid

import React from 'react';
import { Box, Container } from '@mui/material';
import { Header } from './Header';

/**
 * Provides a centered, feed-style layout for WhisperBoard.
 */
export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
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
