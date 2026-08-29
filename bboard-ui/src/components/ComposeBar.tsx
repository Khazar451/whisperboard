// WhisperBoard — Inline Compose Box (X / Twitter Style)

import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import LanguageIcon from '@mui/icons-material/Language';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ComposeBarProps {
  onPost: (message: string) => Promise<void>;
  isPosting: boolean;
}

const PROVING_STEPS = [
  {
    label: 'Constructing Private Witness...',
    detail: 'Generating secret key in browser memory',
    icon: AutoFixHighIcon,
  },
  {
    label: 'Evaluating ZK-SNARK Circuit...',
    detail: 'Generating proof locally via Docker :6300',
    icon: ShieldMoonIcon,
  },
  {
    label: 'Submitting to Midnight Ledger...',
    detail: 'Broadcasting transaction to Preprod network',
    icon: CloudUploadIcon,
  },
];

export const ComposeBar: React.FC<ComposeBarProps> = ({ onPost, isPosting }) => {
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  // Progressive phase timer during ~20s local proof generation
  useEffect(() => {
    if (!isPosting) {
      setCurrentStep(0);
      return;
    }

    const t1 = setTimeout(() => setCurrentStep(1), 5000);
    const t2 = setTimeout(() => setCurrentStep(2), 14000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isPosting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPosting) return;
    await onPost(message.trim());
    setMessage('');
  };

  const ActiveStepIcon = PROVING_STEPS[currentStep].icon;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 2,
        borderBottom: '1px solid #2f3336',
        bgcolor: '#000000',
      }}
    >
      {/* Left Column: Avatar */}
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: '#2f3336',
          color: '#e7e9ea',
          fontWeight: 700,
          fontSize: '0.9rem',
          flexShrink: 0,
        }}
      >
        🛡️
      </Avatar>

      {/* Right Column: Text Input + Tools */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Whisper something anonymously..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPosting}
          variant="standard"
          slotProps={{
            input: {
              disableUnderline: true,
              sx: {
                color: '#e7e9ea',
                fontSize: '1.25rem',
                lineHeight: 1.4,
                p: 0,
                '&::placeholder': {
                  color: '#71767b',
                  opacity: 1,
                },
              },
            },
          }}
        />

        {/* ZK Proving Stepper Banner */}
        {isPosting && (
          <Fade in={isPosting}>
            <Box
              sx={{
                my: 1.5,
                p: 1.5,
                borderRadius: 3,
                bgcolor: '#16181c',
                border: '1px solid #2f3336',
              }}
            >
              <LinearProgress
                variant="determinate"
                value={currentStep === 0 ? 30 : currentStep === 1 ? 70 : 95}
                sx={{
                  height: 3,
                  borderRadius: 2,
                  bgcolor: '#2f3336',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#1d9bf0',
                  },
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 1.2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ActiveStepIcon sx={{ fontSize: 16, color: '#1d9bf0' }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#e7e9ea', fontFamily: 'monospace' }}>
                    {PROVING_STEPS[currentStep].label}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#71767b', fontFamily: 'monospace' }}>
                  {PROVING_STEPS[currentStep].detail}
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}

        {/* Bottom Toolbar & Action */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1.5,
            pt: 1.2,
            borderTop: '1px solid #2f3336',
          }}
        >
          {/* Privacy Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Zero-Knowledge Shield Active">
              <IconButton size="small" sx={{ color: '#1d9bf0' }}>
                <LockIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Selective Disclosure (Private Witness)">
              <IconButton size="small" sx={{ color: '#1d9bf0' }}>
                <ShieldIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Midnight Preprod Layer 1">
              <IconButton size="small" sx={{ color: '#1d9bf0' }}>
                <LanguageIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Post Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!message.trim() || isPosting}
            sx={{
              px: 2.5,
              py: 0.7,
              fontSize: '0.9375rem',
              fontWeight: 700,
              borderRadius: 9999,
            }}
          >
            {isPosting ? 'Proving...' : 'Whisper'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
