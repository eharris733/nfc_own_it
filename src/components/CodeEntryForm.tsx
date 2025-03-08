import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { Track } from '../types';

interface CodeEntryFormProps {
  onTrackUnlock: (track: Track) => void;
}

const CodeEntryForm: React.FC<CodeEntryFormProps> = ({ onTrackUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/tracks/by-code/${code.trim()}`);
      if (!response.ok) {
        throw new Error('Invalid code');
      }
      const track = await response.json();
      onTrackUnlock(track);
      setCode('');
    } catch (err) {
      setError('Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: '400px', width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Enter Your Access Code
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Access Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter your 6-character code"
            error={!!error}
            helperText={error}
            disabled={isLoading}
            inputProps={{ maxLength: 6 }}
            sx={{ '& input': { textTransform: 'uppercase' } }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ position: 'relative' }}
          >
            {isLoading ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
                Unlocking...
              </>
            ) : (
              'Unlock Track'
            )}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CodeEntryForm; 