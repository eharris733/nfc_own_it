import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, Snackbar, IconButton, Switch, FormControlLabel } from '@mui/material';
import { Add, Menu } from '@mui/icons-material';
import AudioPlayer from './components/AudioPlayer';
import UploadForm from './components/UploadForm';
import TrackList from './components/TrackList';
import CodeEntryForm from './components/CodeEntryForm';
import { Track } from './types';

const UNLOCKED_TRACKS_KEY = 'unlockedTracks';

const App: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(true);
  const [showTrackList, setShowTrackList] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [unlockedTracks, setUnlockedTracks] = useState<Track[]>([]);

  useEffect(() => {
    // Load unlocked tracks from localStorage on component mount
    const savedTracks = localStorage.getItem(UNLOCKED_TRACKS_KEY);
    if (savedTracks) {
      try {
        setUnlockedTracks(JSON.parse(savedTracks));
      } catch (err) {
        console.error('Error loading unlocked tracks:', err);
      }
    }
  }, []);

  useEffect(() => {
    // Save unlocked tracks to localStorage whenever they change
    localStorage.setItem(UNLOCKED_TRACKS_KEY, JSON.stringify(unlockedTracks));
  }, [unlockedTracks]);

  const fetchTracks = async () => {
    if (!isAdminView) return; // Don't fetch all tracks in fan view
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
    if (isAdminView) {
      fetchTracks();
    } else {
      setTracks(unlockedTracks);
    }
  }, [isAdminView, unlockedTracks]);

  const handleUploadComplete = () => {
    setShowUploadForm(false);
    fetchTracks();
  };

  const handleTrackDelete = (deletedTrackId: string) => {
    setTracks(prevTracks => prevTracks.filter(track => track._id !== deletedTrackId));
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setTracks([track]); // Update the tracks list to only show the selected track
  };

  const handleTrackUnlock = (track: Track) => {
    if (!unlockedTracks.some(t => t._id === track._id)) {
      const newUnlockedTracks = [...unlockedTracks, track];
      setUnlockedTracks(newUnlockedTracks);
      setTracks(newUnlockedTracks);
    }
  };

  const handleViewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAdminView(e.target.checked);
    if (!e.target.checked) {
      setShowUploadForm(false);
      setTracks(unlockedTracks);
    } else {
      fetchTracks();
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Track List Sidebar */}
      <TrackList
        onTrackSelect={handleTrackSelect}
        isVisible={showTrackList && isAdminView}
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'lightgreen',
          minHeight: '100vh',
          position: 'relative',
          pt: 4,
          px: 2,
          ml: showTrackList && isAdminView ? '300px' : 0,
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <IconButton
            onClick={() => setShowTrackList(!showTrackList)}
            sx={{ display: isAdminView ? 'block' : 'none' }}
          >
            <Menu />
          </IconButton>
          
          <FormControlLabel
            control={
              <Switch
                checked={isAdminView}
                onChange={handleViewChange}
              />
            }
            label={isAdminView ? "Admin View" : "Fan View"}
          />

          {isAdminView && (
            <Button
              variant="contained"
              onClick={() => setShowUploadForm(!showUploadForm)}
              startIcon={<Add />}
            >
              {showUploadForm ? 'Hide Upload Form' : 'Upload Track'}
            </Button>
          )}
        </Box>

        {showUploadForm && isAdminView && (
          <UploadForm onUploadComplete={handleUploadComplete} />
        )}

        {!isAdminView && tracks.length === 0 && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 4 }}>
            <CodeEntryForm onTrackUnlock={handleTrackUnlock} />
          </Box>
        )}

        {tracks.length > 0 ? (
          <Box sx={{ mt: showUploadForm ? 4 : 0, width: '100%', maxWidth: '800px' }}>
            <AudioPlayer
              tracks={tracks}
              onTrackDelete={isAdminView ? handleTrackDelete : undefined}
            />
          </Box>
        ) : (
          <Box sx={{ mt: showUploadForm ? 4 : 0, textAlign: 'center' }}>
            <Alert severity="info">
              {isAdminView
                ? "No tracks available. Click 'Upload Track' to add your first track!"
                : "Enter a track code to start listening!"}
            </Alert>
          </Box>
        )}

        {!isAdminView && tracks.length > 0 && (
          <Box sx={{ mt: 4, width: '100%', maxWidth: '400px' }}>
            <CodeEntryForm onTrackUnlock={handleTrackUnlock} />
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
    </Box>
  );
};

export default App; 