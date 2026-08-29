// WhisperBoard — Post Row (Authentic X / Twitter Style with Reliable Message Rendering & Threaded Comments)

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Skeleton,
  CircularProgress,
  TextField,
  Button,
} from '@mui/material';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IosShareIcon from '@mui/icons-material/IosShare';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import LockIcon from '@mui/icons-material/Lock';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyIcon from '@mui/icons-material/Reply';
import { type BBoardDerivedState, type DeployedBBoardAPI } from '../../../api/src/index';
import { type BoardDeployment } from '../contexts';
import { type Observable } from 'rxjs';
import { State } from '../../../contract/src/index';

export interface BoardProps {
  boardDeployment$?: Observable<BoardDeployment>;
}

interface CommentItem {
  id: string;
  text: string;
  timestamp: string;
  tag: string;
  handle: string;
}

function getDeterministicAvatar(address: string) {
  if (!address) {
    return {
      bg: '#2f3336',
      tag: 'Anon #????',
      handle: '@anon_????',
      initials: '??',
    };
  }

  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  const bg = `hsl(${hue}, 65%, 45%)`;
  const suffix = address.slice(-4);
  const tag = `Anon #${suffix}`;
  const handle = `@anon_${suffix}`;
  const initials = address.slice(-2).toUpperCase();

  return { bg, tag, handle, initials };
}

export const Board: React.FC<Readonly<BoardProps>> = ({ boardDeployment$ }) => {
  const [boardDeployment, setBoardDeployment] = useState<BoardDeployment>();
  const [deployedBoardAPI, setDeployedBoardAPI] = useState<DeployedBBoardAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [boardState, setBoardState] = useState<BBoardDerivedState>();
  const [isWorking, setIsWorking] = useState(!!boardDeployment$);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Threaded Comments State
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const replyInputRef = useRef<HTMLInputElement>(null);

  const contractAddress = deployedBoardAPI?.deployedContractAddress ?? '';

  // Local caching for instant message display
  const [cachedMessage, setCachedMessage] = useState<string>(() => {
    if (!contractAddress) return '';
    return localStorage.getItem(`whisperboard_msg_${contractAddress}`) || '';
  });

  const [comments, setComments] = useState<CommentItem[]>(() => {
    if (!contractAddress) return [];
    try {
      const saved = localStorage.getItem(`whisperboard_comments_${contractAddress}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reload cache & comments when contract address is ready
  useEffect(() => {
    if (!contractAddress) return;
    try {
      const savedMsg = localStorage.getItem(`whisperboard_msg_${contractAddress}`);
      if (savedMsg) setCachedMessage(savedMsg);

      const savedComments = localStorage.getItem(`whisperboard_comments_${contractAddress}`);
      if (savedComments) setComments(JSON.parse(savedComments));
    } catch (e) {
      console.error('Error loading cached post data:', e);
    }
  }, [contractAddress]);

  useEffect(() => {
    if (!boardDeployment$) return;
    const subscription = boardDeployment$.subscribe(setBoardDeployment);
    return () => {
      subscription.unsubscribe();
    };
  }, [boardDeployment$]);

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
    const subscription = boardDeployment.api.state$.subscribe((state) => {
      setBoardState(state);
      if (state.message && boardDeployment.api.deployedContractAddress) {
        localStorage.setItem(`whisperboard_msg_${boardDeployment.api.deployedContractAddress}`, state.message);
        setCachedMessage(state.message);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [boardDeployment]);

  // Focus reply input when reply box opens
  useEffect(() => {
    if (showReplyBox) {
      setTimeout(() => {
        replyInputRef.current?.focus();
      }, 100);
    }
  }, [showReplyBox]);

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

  const avatar = useMemo(() => getDeterministicAvatar(contractAddress), [contractAddress]);

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contractAddress) return;
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy address:', e);
    }
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleToggleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowReplyBox((prev) => !prev);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      text: replyText.trim(),
      timestamp: 'Just now',
      tag: 'Anon Responder',
      handle: '@anon_reply',
    };

    const updated = [...comments, newComment];
    setComments(updated);
    if (contractAddress) {
      try {
        localStorage.setItem(`whisperboard_comments_${contractAddress}`, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save comment:', err);
      }
    }
    setReplyText('');
    setShowReplyBox(true); // Keep thread open
  };

  if (!boardDeployment$) {
    return null;
  }

  // Loading Skeleton row
  if (isWorking && !boardState && !cachedMessage) {
    return (
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          p: 2,
          borderBottom: '1px solid #2f3336',
          bgcolor: '#000000',
        }}
      >
        <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: '#16181c' }} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: '#16181c' }} />
            <Skeleton variant="text" width={80} height={16} sx={{ bgcolor: '#16181c' }} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              borderRadius: 2,
              bgcolor: '#16181c',
              border: '1px solid #2f3336',
              mb: 1.5,
            }}
          >
            <CircularProgress size={14} sx={{ color: '#1d9bf0' }} />
            <Typography sx={{ color: '#71767b', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              Deploying shielded contract &amp; proving ZK-SNARK...
            </Typography>
          </Box>
          <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1, bgcolor: '#16181c' }} />
        </Box>
      </Box>
    );
  }

  // Error Row
  if (errorMessage) {
    return (
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #2f3336',
          bgcolor: 'rgba(244, 33, 46, 0.05)',
        }}
      >
        <Typography sx={{ color: '#f4212e', fontSize: '0.875rem' }}>
          {errorMessage}
        </Typography>
      </Box>
    );
  }

  // Vacant board check
  if (boardState && boardState.state === State.VACANT) {
    return null;
  }

  const isOwner = !!boardState?.isOwner;
  const rawMessage = boardState?.message || cachedMessage;
  const displayMessage = rawMessage || (boardState ? 'Shielded whisper' : '');

  return (
    <Box
      sx={{
        borderBottom: '1px solid #2f3336',
        bgcolor: '#000000',
      }}
    >
      {/* Main Tweet Post Container */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          p: 2,
          transition: 'background-color 0.15s ease',
          '&:hover': {
            bgcolor: 'rgba(231, 233, 234, 0.03)',
          },
        }}
      >
        {/* Left: Avatar */}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: avatar.bg,
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            flexShrink: 0,
          }}
        >
          {avatar.initials}
        </Avatar>

        {/* Right: Tweet Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header Row: Name · Handle · Time · ZK Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#e7e9ea' }}>
                {avatar.tag}
              </Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: '#71767b' }}>
                {avatar.handle}
              </Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: '#71767b' }}>
                ·
              </Typography>

              {/* Cryptographic hash pill */}
              {contractAddress && (
                <Tooltip title={copied ? 'Copied full contract address!' : 'Click to copy contract address'}>
                  <Box
                    onClick={handleCopyAddress}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.4,
                      px: 0.8,
                      py: 0.1,
                      borderRadius: 9999,
                      bgcolor: '#16181c',
                      border: '1px solid #2f3336',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#71767b',
                        bgcolor: '#202327',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: copied ? '#00ba7c' : '#71767b',
                        fontFamily: 'monospace',
                        fontSize: '0.72rem',
                      }}
                    >
                      {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                    </Typography>
                    {copied ? (
                      <CheckIcon sx={{ fontSize: 10, color: '#00ba7c' }} />
                    ) : (
                      <ContentCopyIcon sx={{ fontSize: 9, color: '#71767b' }} />
                    )}
                  </Box>
                </Tooltip>
              )}

              {/* Author ZK Pill Badge */}
              {isOwner && (
                <Tooltip title="You hold the private witness for this post. Only you can delete it.">
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.4,
                      px: 0.8,
                      py: 0.1,
                      borderRadius: 9999,
                      bgcolor: 'rgba(139, 92, 246, 0.12)',
                      border: '1px solid rgba(139, 92, 246, 0.35)',
                    }}
                  >
                    <LockIcon sx={{ fontSize: 10, color: '#a78bfa' }} />
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5fd', fontFamily: 'monospace' }}>
                      Author
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Original Message Text */}
          {displayMessage ? (
            <Typography
              data-testid="board-posted-message"
              sx={{
                color: '#e7e9ea',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                my: 0.8,
              }}
            >
              {displayMessage}
            </Typography>
          ) : (
            <Box sx={{ my: 1 }}>
              <Typography sx={{ color: '#71767b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Shielded whisper
              </Typography>
            </Box>
          )}

          {/* Twitter Action Bar: Reply, Like, Share, Delete */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: 360,
              mt: 1.2,
              color: '#71767b',
            }}
          >
            {/* Reply / Comment Trigger */}
            <Tooltip title="Reply / Comment">
              <Box
                onClick={handleToggleReply}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.6,
                  cursor: 'pointer',
                  color: showReplyBox || comments.length > 0 ? '#1d9bf0' : 'inherit',
                  '&:hover': { color: '#1d9bf0' },
                }}
              >
                <IconButton
                  onClick={handleToggleReply}
                  size="small"
                  sx={{
                    color: showReplyBox ? '#1d9bf0' : 'inherit',
                    p: 0.6,
                    '&:hover': { bgcolor: 'rgba(29, 155, 240, 0.1)', color: '#1d9bf0' },
                  }}
                >
                  <ChatBubbleOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
                {comments.length > 0 && (
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {comments.length}
                  </Typography>
                )}
              </Box>
            </Tooltip>

            {/* Like */}
            <Tooltip title="Like">
              <Box
                onClick={handleToggleLike}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.6,
                  cursor: 'pointer',
                  color: liked ? '#f91880' : 'inherit',
                  '&:hover': { color: '#f91880' },
                }}
              >
                <IconButton
                  onClick={handleToggleLike}
                  size="small"
                  sx={{ color: liked ? '#f91880' : 'inherit', p: 0.6, '&:hover': { bgcolor: 'rgba(249, 24, 128, 0.1)' } }}
                >
                  {liked ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
                </IconButton>
                {likeCount > 0 && (
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    {likeCount}
                  </Typography>
                )}
              </Box>
            </Tooltip>

            {/* Share */}
            <Tooltip title="Copy address">
              <Box
                onClick={handleCopyAddress}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.6,
                  cursor: 'pointer',
                  '&:hover': { color: '#1d9bf0' },
                }}
              >
                <IconButton size="small" sx={{ color: 'inherit', p: 0.6, '&:hover': { bgcolor: 'rgba(29, 155, 240, 0.1)' } }}>
                  <IosShareIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Tooltip>

            {/* Author-only Delete */}
            {isOwner && (
              <Tooltip title="Delete post (Authorized via ZK Proof)">
                <IconButton
                  onClick={onDeleteMessage}
                  disabled={isWorking}
                  size="small"
                  data-testid="board-take-down-message-btn"
                  sx={{
                    color: '#71767b',
                    p: 0.6,
                    '&:hover': {
                      color: '#f4212e',
                      bgcolor: 'rgba(244, 33, 46, 0.1)',
                    },
                  }}
                >
                  <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      {/* Inline Reply Box */}
      {showReplyBox && (
        <Box
          component="form"
          onSubmit={handleSubmitReply}
          sx={{
            display: 'flex',
            gap: 1.5,
            px: 2.5,
            py: 1.5,
            bgcolor: '#16181c',
            borderTop: '1px solid #2f3336',
            borderBottom: comments.length > 0 ? '1px solid #2f3336' : 'none',
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#2f3336',
              color: '#1d9bf0',
              flexShrink: 0,
            }}
          >
            <ReplyIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              inputRef={replyInputRef}
              fullWidth
              size="small"
              placeholder={`Post your reply to ${avatar.tag}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    color: '#e7e9ea',
                    fontSize: '0.9rem',
                    bgcolor: 'transparent',
                    p: 0.5,
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!replyText.trim()}
              size="small"
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 9999,
                fontSize: '0.8rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              Reply
            </Button>
          </Box>
        </Box>
      )}

      {/* Threaded Comments List */}
      {comments.length > 0 && (
        <Box sx={{ bgcolor: '#0a0a0a' }}>
          {comments.map((c) => (
            <Box
              key={c.id}
              sx={{
                display: 'flex',
                gap: 1.5,
                px: 2.5,
                py: 1.2,
                pl: 6.5,
                borderTop: '1px solid rgba(47, 51, 54, 0.4)',
                '&:hover': { bgcolor: 'rgba(231, 233, 234, 0.02)' },
              }}
            >
              <Avatar
                sx={{
                  width: 26,
                  height: 26,
                  bgcolor: '#1d9bf0',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                R
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#e7e9ea' }}>
                    {c.tag}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#71767b' }}>
                    {c.handle}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#71767b' }}>
                    · {c.timestamp}
                  </Typography>
                </Box>
                <Typography sx={{ color: '#e7e9ea', fontSize: '0.875rem', lineHeight: 1.4 }}>
                  {c.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
