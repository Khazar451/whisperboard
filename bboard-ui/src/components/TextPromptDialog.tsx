// WhisperBoard — TextPromptDialog (X / Twitter Style Modal)

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface TextPromptDialogProps {
  prompt: string;
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (text: string) => void;
}

export const TextPromptDialog: React.FC<Readonly<TextPromptDialogProps>> = ({
  prompt,
  isOpen,
  onCancel,
  onSubmit,
}) => {
  const [text, setText] = useState<string>('');

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#000000',
            border: '1px solid #2f3336',
            borderRadius: 4,
            p: 1.5,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, pt: 0.5 }}>
        <IconButton size="small" onClick={onCancel} sx={{ color: '#e7e9ea' }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#e7e9ea' }}>
          {prompt}
        </Typography>
        <Box sx={{ width: 28 }} />
      </Box>

      <DialogContent sx={{ px: 1.5, py: 2 }}>
        <Typography sx={{ fontSize: '0.85rem', color: '#71767b', mb: 1.5 }}>
          Paste the 68-character Midnight contract address to load its shielded post into your feed.
        </Typography>
        <TextField
          id="text-prompt"
          fullWidth
          placeholder="0200dbf964f541e1950883f5b2f539b66..."
          size="small"
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value.trim())}
          slotProps={{
            input: {
              sx: {
                bgcolor: '#16181c',
                color: '#e7e9ea',
                borderRadius: 2,
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                border: '1px solid #2f3336',
                '&:focus-within': {
                  borderColor: '#1d9bf0',
                },
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 1.5, pb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          disabled={!text.length}
          onClick={() => {
            onSubmit(text);
            setText('');
          }}
          sx={{
            py: 1.2,
            fontWeight: 800,
            fontSize: '0.95rem',
            borderRadius: 9999,
          }}
        >
          Join Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};
