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
 * Renders an authentic X / Twitter style feed of anonymous whispers.
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

  const handleFocusCompose = () => {
    const el = document.querySelector('textarea');
    if (el) {
      el.focus();
    }
  };

  return (
    <Box sx={{ bgcolor: '#000000', minHeight: '100vh', color: '#e7e9ea' }}>
      <MainLayout
        onJoinClick={() => setJoinDialogOpen(true)}
        knownContractsCount={knownAddresses.length}
        onComposeClick={handleFocusCompose}
      >
        {/* Inline X Compose Box */}
        <ComposeBar onPost={handlePost} isPosting={isPosting} />

        {/* Feed of tweets/whispers (newest first) */}
        {[...boardDeployments].reverse().map((boardDeployment, idx) => (
          <div data-testid={`board-${idx}`} key={`board-${idx}`}>
            <Board boardDeployment$={boardDeployment} />
          </div>
        ))}

        {/* Empty state (X / Twitter style) */}
        {boardDeployments.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              borderBottom: '1px solid #2f3336',
            }}
          >
            <Typography sx={{ fontSize: '2.5rem', mb: 1.5 }}>
              🤫
            </Typography>
            <Typography
              sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#e7e9ea', mb: 1, letterSpacing: '-0.03em' }}
            >
              Welcome to WhisperBoard!
            </Typography>
            <Typography
              sx={{ color: '#71767b', fontSize: '0.9375rem', maxWidth: 380, mx: 'auto', lineHeight: 1.5 }}
            >
              This is the beginning of your shielded feed. Speak freely — every post is proven locally on your machine and protected by Midnight zero-knowledge cryptography.
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
