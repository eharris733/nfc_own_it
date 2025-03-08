import React from 'react';
import { Box, IconButton, Typography, Slider } from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  VolumeDown,
  VolumeUp,
  Delete,
  MusicNote
} from '@mui/icons-material';
import useAudioPlayer from '../hooks/useAudioPlayer';
import { formatTime } from '../utils/formatTime';
import { Track } from '../types';

interface AudioPlayerProps {
  tracks: Track[];
  onTrackDelete?: (trackId: string) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ tracks, onTrackDelete }) => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    handleVolumeChange,
    handleProgressChange,
    playPreviousTrack,
    playNextTrack,
  } = useAudioPlayer(tracks);

  const handleDelete = async (trackId: string) => {
    if (!onTrackDelete || !trackId) {
      console.error('Delete handler not provided or invalid track ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this track?')) {
      try {
        const response = await fetch(`http://localhost:8000/tracks/${trackId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to delete track');
        }
        
        onTrackDelete(trackId);
      } catch (error) {
        console.error('Error deleting track:', error);
        alert('Failed to delete track. Please try again.');
      }
    }
  };

  if (!currentTrack) return null;

  return (
    <Box sx={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          PLAYING {tracks.indexOf(currentTrack) + 1} OF {tracks.length}
        </Typography>
        <IconButton
          onClick={() => handleDelete(currentTrack._id)}
          color="error"
          size="large"
          sx={{ '&:hover': { transform: 'scale(1.1)' } }}
        >
          <Delete />
        </IconButton>
      </Box>

      {currentTrack.image ? (
        <Box
          sx={{
            height: 250,
            width: 250,
            overflow: 'hidden',
            borderRadius: '15%',
            margin: '2rem auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <img 
            src={currentTrack.image}
            alt={`${currentTrack.name} cover`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            height: 250,
            width: 250,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '15%',
            margin: '2rem auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: '#2196f3',
          }}
        >
          <MusicNote sx={{ fontSize: 120, color: 'white' }} />
        </Box>
      )}

      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
        {currentTrack.name}
      </Typography>
      <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3 }}>
        {currentTrack.artist}
      </Typography>

      {/* Progress Bar */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Slider
          value={progress}
          min={0}
          max={duration || 100}
          onChange={handleProgressChange}
          sx={{ color: 'primary.main' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption">{formatTime(progress)}</Typography>
          <Typography variant="caption">{formatTime(duration)}</Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <IconButton onClick={playPreviousTrack} color="primary">
          <SkipPrevious fontSize="large" />
        </IconButton>
        <IconButton
          onClick={togglePlay}
          color="primary"
          sx={{
            width: 64,
            height: 64,
            '&:hover': { transform: 'scale(1.1)' },
            transition: 'transform 0.2s',
          }}
        >
          {isPlaying ? (
            <Pause sx={{ fontSize: 64 }} />
          ) : (
            <PlayArrow sx={{ fontSize: 64 }} />
          )}
        </IconButton>
        <IconButton onClick={playNextTrack} color="primary">
          <SkipNext fontSize="large" />
        </IconButton>
      </Box>

      {/* Volume Control */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '200px',
          margin: '2rem auto',
        }}
      >
        <VolumeDown />
        <Slider
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={handleVolumeChange}
          aria-label="Volume"
          sx={{ mx: 2 }}
        />
        <VolumeUp />
      </Box>
    </Box>
  );
};

export default AudioPlayer; 