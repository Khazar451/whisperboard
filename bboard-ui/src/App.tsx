// WhisperBoard — Anonymous Group Feedback on Midnight
// Root application component with compose bar, feed, URL/localStorage persistence, and join dialog

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MainLayout } from './components/Layout';
import { Board } from './components/Board';
import { ComposeBar } from './components/ComposeBar';
import { TextPromptDialog } from './components/TextPromptDialog';
import { useDeployedBoardContext } from './hooks';
import { type BoardDeployment } from './contexts';
import { type Observable } from 'rxjs';

const STORAGE_KEY = 'whisperboard_known_contracts';

/**
 * The root WhisperBoard application component.
 *
 * @remarks
 * Renders a compose bar at the top and a vertical feed of anonymous whispers below.
 * Manages contract address discovery, localStorage persistence, and multi-device sync via URL hash/params.
 */
const App: React.FC = () => {
  const boardApiProvider = useDeployedBoardContext();
  const [boardDeployments, setBoardDeployments] = useState<Array<Observable<BoardDeployment>>>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [knownAddresses, setKnownAddresses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Subscribe to deployments list
  useEffect(() => {
    const subscription = boardApiProvider.boardDeployments$.subscribe(setBoardDeployments);
    return () => {
      subscription.unsubscribe();
    };
  }, [boardApiProvider]);

  // Load initial contracts from localStorage and URL query params
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedAddrs: string[] = saved ? JSON.parse(saved) : [];

      const urlParams = new URLSearchParams(window.location.search);
      const urlBoards = urlParams.get('boards')?.split(',').filter(Boolean) || [];

      const combined = Array.from(new Set([...savedAddrs, ...urlBoards]));
      if (combined.length > 0) {
        setKnownAddresses(combined);
        combined.forEach((addr) => {
          boardApiProvider.resolve(addr);
        });
      }
    } catch (err) {
      console.error('Error loading known contracts:', err);
    }
  }, [boardApiProvider]);

  // Listen to board deployments and persist discovered contract addresses
  useEffect(() => {
    const unsubs = boardDeployments.map((dep$) =>
      dep$.subscribe((dep) => {
        if (dep.status === 'deployed') {
          const addr = dep.api.deployedContractAddress;
          setKnownAddresses((prev) => {
            if (!prev.includes(addr)) {
              const updated = [...prev, addr];
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
              } catch (e) {
                console.error('Failed to save to localStorage:', e);
              }
              return updated;
            }
            return prev;
          });
        }
      }),
    );

    return () => {
      unsubs.forEach((u) => u.unsubscribe());
    };
  }, [boardDeployments]);

  /**
   * Creates a new board deployment (which triggers contract deployment),
   * then immediately posts the message to it.
   */
  const handlePost = useCallback(
    async (message: string) => {
      setIsPosting(true);
      try {
        const deployment$ = boardApiProvider.resolve();

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
    },
    [boardApiProvider],
  );

  const handleJoinContract = useCallback(
    (contractAddress: string) => {
      if (!contractAddress) return;
      boardApiProvider.resolve(contractAddress);
    },
    [boardApiProvider],
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <MainLayout
        onJoinClick={() => setJoinDialogOpen(true)}
        knownContractsCount={knownAddresses.length}
      >
        {/* Compose bar with Depth and Stepper */}
        <ComposeBar onPost={handlePost} isPosting={isPosting} />

        {/* Feed of whispers (newest first) */}
        {[...boardDeployments].reverse().map((boardDeployment, idx) => (
          <div data-testid={`board-${idx}`} key={`board-${idx}`}>
            <Board boardDeployment$={boardDeployment} />
          </div>
        ))}

        {/* Empty state with Glassmorphism container */}
        {boardDeployments.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 7,
              px: 4,
              borderRadius: 4,
              bgcolor: 'rgba(21, 23, 34, 0.45)',
              backdropFilter: 'blur(12px)',
              border: '1px dashed rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 1.5,
                background: 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2.5rem',
              }}
            >
              🤫
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'text.primary', mb: 1, fontWeight: 700, letterSpacing: '-0.025em' }}
            >
              No whispers in feed yet
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}
            >
              Be the first to share something anonymously. Your identity is protected by zero-knowledge
              proofs — no one, not even the blockchain, knows who you are.
            </Typography>
          </Box>
        )}

        {/* Join Contract Dialog */}
        <TextPromptDialog
          prompt="Import Contract Address"
          isOpen={joinDialogOpen}
          onCancel={() => setJoinDialogOpen(false)}
          onSubmit={(addr) => {
            setJoinDialogOpen(false);
            handleJoinContract(addr);
          }}
        />
      </MainLayout>
    </Box>
  );
};

export default App;
