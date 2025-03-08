import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LockOpen } from '@mui/icons-material';
import ApiService from '../services/api';

interface UnlockContentProps {
  onUnlock?: () => void;
}

const UnlockContent: React.FC<UnlockContentProps> = ({ onUnlock }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUnlock = async () => {
    if (!token.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await ApiService.unlockContent(token);
      setSuccess(true);
      onUnlock?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Unlock Premium Content
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your access token to unlock premium content
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Content unlocked successfully!
        </Alert>
      )}

      <TextField
        fullWidth
        label="Access Token"
        variant="outlined"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleUnlock}
        disabled={loading || !token.trim()}
        startIcon={loading ? <CircularProgress size={20} /> : <LockOpen />}
        sx={{
          py: 1.5,
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          transition: 'transform 0.2s',
        }}
      >
        {loading ? 'Unlocking...' : 'Unlock Content'}
      </Button>
    </Box>
  );
};

export default UnlockContent; 