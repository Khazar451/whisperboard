// WhisperBoard — Anonymous Group Feedback on Midnight
// Compose bar for creating new anonymous whispers

import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SendIcon from '@mui/icons-material/Send';

interface ComposeBarProps {
  onPost: (message: string) => Promise<void>;
  isPosting: boolean;
}

/**
 * A sticky compose bar that handles text input and triggers board creation + message dispatch.
 * Shows optimistic loading state during ZK proof generation (~15-30s).
 */
export const ComposeBar: React.FC<ComposeBarProps> = ({ onPost, isPosting }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPosting) return;
    await onPost(message.trim());
    setMessage('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2.5,
        mb: 4,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Whisper something anonymously... (Protected by Midnight ZK-SNARKs)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isPosting}
        variant="standard"
        slotProps={{
          input: {
            disableUnderline: true,
            sx: { color: 'text.primary', fontSize: '0.95rem' },
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          pt: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}>
          <LockIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            Zero-Knowledge Shield Active
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!message.trim() || isPosting}
          endIcon={isPosting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          sx={{ px: 3, fontWeight: 600 }}
        >
          {isPosting ? 'Proving & Deploying...' : 'Whisper'}
        </Button>
      </Box>
    </Box>
  );
};
