// WhisperBoard — Anonymous Group Feedback on Midnight
// Feed item card with deterministic pseudonyms and ZK-only deletion

import React, { useCallback, useEffect, useState } from 'react';
import { type ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Skeleton,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShieldIcon from '@mui/icons-material/Shield';
import StopIcon from '@mui/icons-material/HighlightOffOutlined';
import { type BBoardDerivedState, type DeployedBBoardAPI } from '../../../api/src/index';
import { type BoardDeployment } from '../contexts';
import { type Observable } from 'rxjs';
import { State } from '../../../contract/src/index';

/** The props required by the {@link Board} component. */
export interface BoardProps {
  /** The observable bulletin board deployment. */
  boardDeployment$?: Observable<BoardDeployment>;
}

/**
 * Renders a single whisper post as a feed item card.
 * Shows the message text, an anonymous identifier derived from the contract address,
 * and a delete button only if the current user is the ZK-proven owner.
 */
export const Board: React.FC<Readonly<BoardProps>> = ({ boardDeployment$ }) => {
  const [boardDeployment, setBoardDeployment] = useState<BoardDeployment>();
  const [deployedBoardAPI, setDeployedBoardAPI] = useState<DeployedBBoardAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [boardState, setBoardState] = useState<BBoardDerivedState>();
  const [isWorking, setIsWorking] = useState(!!boardDeployment$);

  // Subscribe to the board deployment observable
  useEffect(() => {
    if (!boardDeployment$) return;
    const subscription = boardDeployment$.subscribe(setBoardDeployment);
    return () => { subscription.unsubscribe(); };
  }, [boardDeployment$]);

  // Once deployed, subscribe to contract state changes
  useEffect(() => {
    if (!boardDeployment) return;
    if (boardDeployment.status === 'in-progress') return;

    setIsWorking(false);

    if (boardDeployment.status === 'failed') {
      setErrorMessage(
        boardDeployment.error.message.length ? boardDeployment.error.message : 'Encountered an unexpected error.',
      );
      return;
    }

    setDeployedBoardAPI(boardDeployment.api);
    const subscription = boardDeployment.api.state$.subscribe(setBoardState);
    return () => { subscription.unsubscribe(); };
  }, [boardDeployment]);

  // Handle taking down a message
  const onDeleteMessage = useCallback(async () => {
    try {
      if (deployedBoardAPI) {
        setIsWorking(true);
        await deployedBoardAPI.takeDown();
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedBoardAPI]);

  // Don't render boards without a deployment (the empty "create" card is removed — ComposeBar handles that now)
  if (!boardDeployment$) {
    return null;
  }

  // Loading skeleton while deploying/joining
  if (isWorking && !boardState) {
    return (
      <Card
        sx={{
          mb: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box>
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="text" width={120} height={14} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CircularProgress size={14} sx={{ color: 'primary.main' }} />
            <Typography variant="caption" sx={{ color: 'primary.light', fontFamily: 'monospace' }}>
              Generating ZK Proof &amp; Deploying Shielded Post...
            </Typography>
          </Box>
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (errorMessage) {
    return (
      <Card
        sx={{
          mb: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'error.dark',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StopIcon fontSize="small" sx={{ color: 'error.light' }} />
            <Typography variant="body2" data-testid="board-error-message" sx={{ color: 'error.light' }}>
              {errorMessage}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Don't show vacant boards in the feed (they have no message)
  if (boardState && boardState.state === State.VACANT) {
    return null;
  }

  // Render the whisper post
  const contractAddress = deployedBoardAPI?.deployedContractAddress ?? '';
  const anonTag = contractAddress ? `Anon #${contractAddress.slice(-4)}` : 'Anonymous';
  const avatarLetters = contractAddress ? contractAddress.slice(-2).toUpperCase() : '??';

  return (
    <Card
      sx={{
        mb: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: boardState?.isOwner ? 'primary.dark' : 'divider',
        borderRadius: 3,
        transition: 'border-color 0.2s ease',
        '&:hover': { borderColor: 'primary.main' },
        position: 'relative',
      }}
    >
      {/* Loading overlay for delete operations */}
      <Backdrop
        sx={{ position: 'absolute', color: '#fff', zIndex: 10, borderRadius: 3 }}
        open={isWorking}
      >
        <CircularProgress size={24} data-testid="board-working-indicator" />
      </Backdrop>

      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Header: anon identity + actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.dark',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {avatarLetters}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {anonTag}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                {contractAddress ? `${contractAddress.slice(0, 10)}...${contractAddress.slice(-6)}` : '...'}
              </Typography>
            </Box>
          </Box>

          {boardState?.isOwner ? (
            <Tooltip title="Delete Post (Authorized via ZK Proof)">
              <IconButton
                onClick={onDeleteMessage}
                disabled={isWorking}
                data-testid="board-take-down-message-btn"
                sx={{ color: 'error.light', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Protected by ZK — only the author can remove this">
              <ShieldIcon sx={{ fontSize: 18, color: 'text.secondary', opacity: 0.6 }} />
            </Tooltip>
          )}
        </Box>

        {/* Message body */}
        {boardState ? (
          <Typography
            variant="body1"
            data-testid="board-posted-message"
            sx={{ color: 'text.primary', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
          >
            {boardState.message}
          </Typography>
        ) : (
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
        )}
      </CardContent>
    </Card>
  );
};
