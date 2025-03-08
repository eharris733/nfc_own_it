import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, Snackbar } from '@mui/material';
import { Add } from '@mui/icons-material';
import AudioPlayer from './components/AudioPlayer';
import UploadForm from './components/UploadForm';
import { Track } from './types';

const App: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = async () => {
    try {
      const response = await fetch('http://localhost:8000/tracks');
      if (!response.ok) {
        throw new Error('Failed to fetch tracks');
      }
      const data = await response.json();
      setTracks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tracks. Please try again later.');
      console.error('Error fetching tracks:', err);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleUploadComplete = () => {
    setShowUploadForm(false);
    fetchTracks();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'lightgreen',
        minHeight: '100vh',
        position: 'relative',
        pt: 4,
        px: 2,
      }}
    >
      <Button
        variant="contained"
        onClick={() => setShowUploadForm(!showUploadForm)}
        startIcon={<Add />}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}
      >
        {showUploadForm ? 'Hide Upload Form' : 'Upload Track'}
      </Button>

      {showUploadForm && <UploadForm onUploadComplete={handleUploadComplete} />}

      {tracks.length > 0 ? (
        <Box sx={{ mt: showUploadForm ? 4 : 0, width: '100%', maxWidth: '800px' }}>
          <AudioPlayer tracks={tracks} />
        </Box>
      ) : (
        <Box sx={{ mt: showUploadForm ? 4 : 0, textAlign: 'center' }}>
          <Alert severity="info">
            No tracks available. Click "Upload Track" to add your first track!
          </Alert>
        </Box>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App; 