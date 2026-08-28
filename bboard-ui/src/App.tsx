// WhisperBoard — Anonymous Group Feedback on Midnight
// Root application component with compose bar and feed

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MainLayout } from './components/Layout';
import { Board } from './components/Board';
import { ComposeBar } from './components/ComposeBar';
import { useDeployedBoardContext } from './hooks';
import { type BoardDeployment } from './contexts';
import { type Observable } from 'rxjs';

/**
 * The root WhisperBoard application component.
 *
 * @remarks
 * Renders a compose bar at the top and a vertical feed of anonymous whispers below.
 * Each whisper is a separate board deployment — the compose bar triggers deploying
 * a new board and immediately posting to it.
 */
const App: React.FC = () => {
  const boardApiProvider = useDeployedBoardContext();
  const [boardDeployments, setBoardDeployments] = useState<Array<Observable<BoardDeployment>>>([]);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const subscription = boardApiProvider.boardDeployments$.subscribe(setBoardDeployments);
    return () => { subscription.unsubscribe(); };
  }, [boardApiProvider]);

  /**
   * Creates a new board deployment (which triggers contract deployment),
   * then immediately posts the message to it.
   */
  const handlePost = useCallback(async (message: string) => {
    setIsPosting(true);
    try {
      // resolve() with no address deploys a new board.
      // The Board component will handle the deployment state and show loading.
      const deployment$ = boardApiProvider.resolve();

      // Wait for deployment to complete, then post
      const subscription = deployment$.subscribe(async (deployment: BoardDeployment) => {
        if (deployment.status === 'deployed') {
          try {
            await deployment.api.post(message);
          } catch (error) {
            console.error('Failed to post message:', error);
          } finally {
            setIsPosting(false);
          }
          subscription.unsubscribe();
        } else if (deployment.status === 'failed') {
          console.error('Board deployment failed:', deployment.error);
          setIsPosting(false);
          subscription.unsubscribe();
        }
      });
    } catch (error) {
      console.error('Failed to create board:', error);
      setIsPosting(false);
    }
  }, [boardApiProvider]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <MainLayout>
        {/* Compose bar */}
        <ComposeBar onPost={handlePost} isPosting={isPosting} />

        {/* Feed of whispers (newest first) */}
        {[...boardDeployments].reverse().map((boardDeployment, idx) => (
          <div data-testid={`board-${idx}`} key={`board-${idx}`}>
            <Board boardDeployment$={boardDeployment} />
          </div>
        ))}

        {/* Empty state */}
        {boardDeployments.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              🤫
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1, fontWeight: 500 }}>
              No whispers yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360, mx: 'auto' }}>
              Be the first to share something anonymously. Your identity is protected by zero-knowledge
              proofs — no one, not even the blockchain, knows who you are.
            </Typography>
          </Box>
        )}
      </MainLayout>
    </Box>
  );
};

export default App;
