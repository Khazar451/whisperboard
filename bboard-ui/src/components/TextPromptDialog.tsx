// WhisperBoard — TextPromptDialog for Joining existing contracts
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

/**
 * The props required by the {@link TextPromptDialog} component.
 */
export interface TextPromptDialogProps {
  /** The prompt to display to the user. */
  prompt: string;
  /** `true` to render the dialog opened; otherwise closed. */
  isOpen: boolean;
  /** A callback that will be called if the user cancels the dialog. */
  onCancel: () => void;
  /** A callback that will be called when the user submits their inputted data. */
  onSubmit: (text: string) => void;
}

/**
 * A modal dialog that prompts the user to enter a contract address to join.
 */
export const TextPromptDialog: React.FC<Readonly<TextPromptDialogProps>> = ({ prompt, isOpen, onCancel, onSubmit }) => {
  const [text, setText] = useState<string>('');

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
          {prompt}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          id="text-prompt"
          variant="outlined"
          fullWidth
          placeholder="e.g. 0200dbf964f541e1950883f5b2f539b66fd6111e46ce8e6e9551fbdd180114d5dd5b"
          size="small"
          color="primary"
          autoComplete="off"
          value={text}
          onChange={(e) => {
            setText(e.target.value.trim());
          }}
          sx={{ mt: 1 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onCancel} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!text.length}
          onClick={() => {
            onSubmit(text);
            setText('');
          }}
          sx={{ textTransform: 'none', px: 3 }}
        >
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};
