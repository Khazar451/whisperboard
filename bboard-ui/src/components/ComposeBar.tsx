// WhisperBoard — Anonymous Group Feedback on Midnight
// Compose bar with Glassmorphism, Ambient Depth, and Multi-Step ZK Proving Stepper

import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  LinearProgress,
  Fade,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SendIcon from '@mui/icons-material/Send';
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
    detail: 'Deriving secret key commitment in local memory',
    icon: AutoFixHighIcon,
  },
  {
    label: 'Evaluating ZK-SNARK Circuit...',
    detail: 'Generating zero-knowledge proof locally via proof server',
    icon: ShieldMoonIcon,
  },
  {
    label: 'Submitting State Transition to Midnight Ledger...',
    detail: 'Broadcasting shielded transaction to Preprod network',
    icon: CloudUploadIcon,
  },
];

/**
 * A sticky compose bar featuring glassmorphic depth and a 3-step ZK-SNARK proving stepper.
 */
export const ComposeBar: React.FC<ComposeBarProps> = ({ onPost, isPosting }) => {
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Progressive phase animation during ~20s local proof generation
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
        p: 2.5,
        mb: 4,
        bgcolor: 'rgba(21, 23, 34, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: 3.5,
        border: '1px solid',
        borderColor: isFocused ? 'rgba(139, 92, 246, 0.45)' : 'rgba(255, 255, 255, 0.08)',
        boxShadow: isFocused
          ? '0 12px 36px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          : '0 8px 32px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Whisper something anonymously... (Protected by Midnight ZK-SNARKs)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isPosting}
        variant="standard"
        slotProps={{
          input: {
            disableUnderline: true,
            sx: {
              color: 'text.primary',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
            },
          },
        }}
      />

      {/* Multi-step ZK Proving Stepper during active proof generation */}
      {isPosting && (
        <Fade in={isPosting}>
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={currentStep === 0 ? 30 : currentStep === 1 ? 70 : 95}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.06)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
                  borderRadius: 2,
                },
              }}
            />

            {/* Stepper Phase Labels */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1.5,
                px: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <ActiveStepIcon
                  sx={{
                    fontSize: 18,
                    color: currentStep === 2 ? '#22d3ee' : '#a78bfa',
                    animation: 'pulseGlow 2s infinite',
                  }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: '#f8fafc',
                      fontFamily: 'monospace',
                      letterSpacing: '0.01em',
                      display: 'block',
                    }}
                  >
                    Step {currentStep + 1}/3: {PROVING_STEPS[currentStep].label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94a3b8',
                      fontSize: '0.7rem',
                    }}
                  >
                    {PROVING_STEPS[currentStep].detail}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#06b6d4',
                  fontWeight: 600,
                  bgcolor: 'rgba(6, 182, 212, 0.1)',
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                }}
              >
                ~{currentStep === 0 ? '18s' : currentStep === 1 ? '10s' : '3s'}
              </Typography>
            </Box>
          </Box>
        </Fade>
      )}

      {/* Footer bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: isPosting ? 1.5 : 2,
          pt: 1.5,
          borderTop: isPosting ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}>
          <LockIcon sx={{ fontSize: 15, color: '#06b6d4' }} />
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: '#94a3b8',
              letterSpacing: '0.01em',
            }}
          >
            Zero-Knowledge Shield Active
          </Typography>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!message.trim() || isPosting}
          endIcon={!isPosting ? <SendIcon sx={{ fontSize: 16 }} /> : null}
          sx={{
            px: 3,
            py: 0.8,
            fontWeight: 700,
            fontSize: '0.875rem',
            letterSpacing: '-0.01em',
          }}
        >
          {isPosting ? 'Proving ZK Circuit...' : 'Whisper'}
        </Button>
      </Box>
    </Box>
  );
};
