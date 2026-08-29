// WhisperBoard — Anonymous Group Feedback on Midnight
// Feed Item Card with Glassmorphism, Deterministic Pastel Avatars, Cryptographic Pill Badges, and Author ZK State

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Chip,
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ShieldIcon from '@mui/icons-material/Shield';
import StopIcon from '@mui/icons-material/HighlightOffOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import KeyIcon from '@mui/icons-material/KeyOutlined';
import { type BBoardDerivedState, type DeployedBBoardAPI } from '../../../api/src/index';
import { type BoardDeployment } from '../contexts';
import { type Observable } from 'rxjs';
import { State } from '../../../contract/src/index';

export interface BoardProps {
  boardDeployment$?: Observable<BoardDeployment>;
}

/**
 * Deterministically generates a unique, aesthetic pastel/neon gradient based on an address string.
 */
function getDeterministicAvatarStyle(address: string) {
  if (!address) {
    return {
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      textColor: '#ffffff',
      tag: 'Anon #????',
      letters: '??',
    };
  }

  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0;
  }

  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 45 + (Math.abs(hash >> 3) % 60)) % 360;

  const gradient = `linear-gradient(135deg, hsl(${hue1}, 75%, 55%) 0%, hsl(${hue2}, 85%, 45%) 100%)`;
  const tag = `Anon #${address.slice(-4)}`;
  const letters = address.slice(-2).toUpperCase();

  return { gradient, textColor: '#ffffff', tag, letters };
}

/**
 * Feed card item featuring glassmorphic depth, deterministic identity badges,
 * cryptographic copyable pill badges, and ZK author state.
 */
export const Board: React.FC<Readonly<BoardProps>> = ({ boardDeployment$ }) => {
  const [boardDeployment, setBoardDeployment] = useState<BoardDeployment>();
  const [deployedBoardAPI, setDeployedBoardAPI] = useState<DeployedBBoardAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [boardState, setBoardState] = useState<BBoardDerivedState>();
  const [isWorking, setIsWorking] = useState(!!boardDeployment$);
  const [copied, setCopied] = useState(false);

  // Subscribe to the board deployment observable
  useEffect(() => {
    if (!boardDeployment$) return;
    const subscription = boardDeployment$.subscribe(setBoardDeployment);
    return () => {
      subscription.unsubscribe();
    };
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
    return () => {
      subscription.unsubscribe();
    };
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

  const contractAddress = deployedBoardAPI?.deployedContractAddress ?? '';

  const avatarInfo = useMemo(() => getDeterministicAvatarStyle(contractAddress), [contractAddress]);

  const handleCopyAddress = async () => {
    if (!contractAddress) return;
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy address:', e);
    }
  };

  // Don't render boards without a deployment
  if (!boardDeployment$) {
    return null;
  }

  // Loading skeleton while deploying/joining
  if (isWorking && !boardState) {
    return (
      <Card
        sx={{
          mb: 2.5,
          bgcolor: 'rgba(21, 23, 34, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3.5,
          boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Skeleton
              variant="circular"
              width={36}
              height={36}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)' }}
            />
            <Box>
              <Skeleton
                variant="text"
                width={90}
                height={20}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)' }}
              />
              <Skeleton
                variant="text"
                width={130}
                height={14}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              mb: 1.5,
              p: 1.2,
              borderRadius: 2,
              bgcolor: 'rgba(139, 92, 246, 0.06)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
            }}
          >
            <CircularProgress size={15} sx={{ color: 'primary.main' }} />
            <Typography
              variant="caption"
              sx={{
                color: 'primary.light',
                fontFamily: 'monospace',
                fontWeight: 600,
                letterSpacing: '0.01em',
              }}
            >
              Generating ZK Proof &amp; Deploying Shielded Post...
            </Typography>
          </Box>
          <Skeleton
            variant="rectangular"
            height={50}
            sx={{ borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.04)' }}
          />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (errorMessage) {
    return (
      <Card
        sx={{
          mb: 2.5,
          bgcolor: 'rgba(21, 23, 34, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 3.5,
          boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.5)',
        }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <StopIcon fontSize="small" sx={{ color: 'error.light' }} />
            <Typography
              variant="body2"
              data-testid="board-error-message"
              sx={{ color: 'error.light', fontWeight: 500 }}
            >
              {errorMessage}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Don't show vacant boards in the feed (they were taken down)
  if (boardState && boardState.state === State.VACANT) {
    return null;
  }

  const isOwner = !!boardState?.isOwner;

  return (
    <Card
      sx={{
        mb: 2.5,
        bgcolor: 'rgba(21, 23, 34, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid',
        borderColor: isOwner ? 'rgba(139, 92, 246, 0.35)' : 'rgba(255, 255, 255, 0.08)',
        borderRadius: 3.5,
        boxShadow: isOwner
          ? '0 8px 30px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          : '0 8px 24px -4px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          borderColor: isOwner ? 'rgba(139, 92, 246, 0.6)' : 'rgba(255, 255, 255, 0.16)',
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      {/* Loading overlay for delete operations */}
      <Backdrop
        sx={{
          position: 'absolute',
          color: '#fff',
          zIndex: 10,
          borderRadius: 3.5,
          bgcolor: 'rgba(13, 14, 21, 0.75)',
          backdropFilter: 'blur(4px)',
        }}
        open={isWorking}
      >
        <CircularProgress size={24} sx={{ color: 'primary.main' }} data-testid="board-working-indicator" />
      </Backdrop>

      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Header: Deterministic Avatar + Anon Pseudonym + Cryptographic Pill Badge + Author State */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Deterministic Gradient Avatar with 1.5px glowing border */}
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: avatarInfo.gradient,
                fontSize: '0.8rem',
                fontWeight: 800,
                color: avatarInfo.textColor,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {avatarInfo.letters}
            </Avatar>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  letterSpacing: '-0.015em',
                  lineHeight: 1.2,
                }}
              >
                {avatarInfo.tag}
              </Typography>

              {/* Styled Cryptographic Pill Badge with click-to-copy */}
              {contractAddress && (
                <Tooltip
                  title={copied ? 'Address copied to clipboard!' : 'Click to copy full contract address'}
                >
                  <Box
                    onClick={handleCopyAddress}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.6,
                      mt: 0.3,
                      px: 0.9,
                      py: 0.2,
                      borderRadius: 10,
                      bgcolor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: 'rgba(139, 92, 246, 0.1)',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: copied ? '#34d399' : '#94a3b8',
                        fontFamily: 'monospace',
                        fontSize: '0.68rem',
                        fontWeight: 500,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}
                    </Typography>
                    {copied ? (
                      <CheckIcon sx={{ fontSize: 11, color: '#34d399' }} />
                    ) : (
                      <ContentCopyIcon sx={{ fontSize: 10, color: '#64748b' }} />
                    )}
                  </Box>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Author vs. Non-Author Visual State */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isOwner ? (
              <React.Fragment>
                <Tooltip title="Your local secret key matches this post's ZK commitment. Only you can take it down.">
                  <Chip
                    icon={<KeyIcon sx={{ fontSize: 13, color: '#a78bfa !important' }} />}
                    label="Author (ZK Shielded)"
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      bgcolor: 'rgba(139, 92, 246, 0.12)',
                      color: '#c4b5fd',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                </Tooltip>

                <Tooltip title="Delete Post (Authorized via Zero-Knowledge Proof)">
                  <IconButton
                    onClick={onDeleteMessage}
                    disabled={isWorking}
                    data-testid="board-take-down-message-btn"
                    size="small"
                    sx={{
                      color: 'error.light',
                      p: 0.8,
                      borderRadius: 2,
                      bgcolor: 'rgba(244, 63, 94, 0.08)',
                      border: '1px solid rgba(244, 63, 94, 0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(244, 63, 94, 0.18)',
                        borderColor: 'error.main',
                      },
                    }}
                  >
                    <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            ) : (
              <Tooltip title="Protected by ZK — only the author possessing the private witness can remove this">
                <Chip
                  icon={<ShieldIcon sx={{ fontSize: 13, color: '#06b6d4 !important' }} />}
                  label="Shielded"
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    bgcolor: 'rgba(6, 182, 212, 0.06)',
                    color: '#67e8f9',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    '& .MuiChip-label': { px: 1 },
                  }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Message body with refined typography */}
        {boardState ? (
          <Typography
            variant="body1"
            data-testid="board-posted-message"
            sx={{
              color: '#f1f5f9',
              whiteSpace: 'pre-wrap',
              fontSize: '0.9375rem', // 15px
              lineHeight: 1.65,
              fontWeight: 400,
              letterSpacing: '-0.005em',
            }}
          >
            {boardState.message}
          </Typography>
        ) : (
          <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 2 }} />
        )}
      </CardContent>
    </Card>
  );
};
