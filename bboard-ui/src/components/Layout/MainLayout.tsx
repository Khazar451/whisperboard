// WhisperBoard — Main Layout (Authentic X / Twitter 3-Column Layout)

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { XSidebar } from './XSidebar';
import { XRightRail } from './XRightRail';
import { Header } from './Header';

export interface MainLayoutProps extends React.PropsWithChildren {
  onJoinClick?: () => void;
  knownContractsCount?: number;
  onComposeClick?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  onJoinClick,
  knownContractsCount,
  onComposeClick,
}) => {
  const [activeTab, setActiveTab] = useState('for_you');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#000000',
        color: '#e7e9ea',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '1280px',
          minHeight: '100vh',
        }}
      >
        {/* Left Navigation Sidebar */}
        <XSidebar onJoinClick={onJoinClick} onComposeClick={onComposeClick} />

        {/* Center Main Feed Column (600px max) */}
        <Box
          component="main"
          sx={{
            flex: 1,
            maxWidth: '600px',
            minHeight: '100vh',
            borderRight: '1px solid #2f3336',
            bgcolor: '#000000',
          }}
        >
          <Header
            onJoinClick={onJoinClick}
            knownContractsCount={knownContractsCount}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          {children}
        </Box>

        {/* Right Rail Widgets */}
        <XRightRail />
      </Box>
    </Box>
  );
};
