import React from 'react';
import { Box, Typography, Slider, IconButton } from '@mui/material';
import {
  PlayCircle,
  PauseCircle,
  SkipNext,
  SkipPrevious,
  VolumeDown,
  VolumeUp,
} from '@mui/icons-material';
import useAudioPlayer from '../hooks/useAudioPlayer';
import { Track } from '../types';
import { formatTime } from '../utils/formatTime';

interface AudioPlayerProps {
  tracks: Track[];
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ tracks }) => {
  const {
    currentTrackIndex,
    isPlaying,
    playPauseTrack,
    nextTrack,
    prevTrack,
    setVolume,
    seekTo,
    currentTrack,
    currentTime,
    duration,
    volume,
  } = useAudioPlayer(tracks);

  if (!currentTrack) return null;

  return (
    <Box sx={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}>
      <Typography variant="h6">
        PLAYING {currentTrackIndex + 1} OF {tracks.length}
      </Typography>
      <Box
        sx={{
          height: 250,
          width: 250,
          backgroundImage: `url(${currentTrack.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '15%',
          margin: '2rem auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      />
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
        {currentTrack.name}
      </Typography>
      <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3 }}>
        {currentTrack.artist}
      </Typography>

      {/* Progress Bar */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Slider
          value={currentTime}
          min={0}
          max={duration || 100}
          onChange={(_, value) => seekTo(value as number)}
          sx={{ color: 'primary.main' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption">{formatTime(currentTime)}</Typography>
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
        <IconButton onClick={prevTrack} color="primary">
          <SkipPrevious fontSize="large" />
        </IconButton>
        <IconButton
          onClick={playPauseTrack}
          color="primary"
          sx={{
            width: 64,
            height: 64,
            '&:hover': { transform: 'scale(1.1)' },
            transition: 'transform 0.2s',
          }}
        >
          {isPlaying ? (
            <PauseCircle sx={{ fontSize: 64 }} />
          ) : (
            <PlayCircle sx={{ fontSize: 64 }} />
          )}
        </IconButton>
        <IconButton onClick={nextTrack} color="primary">
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
          max={100}
          onChange={(_, value) => setVolume(value as number)}
          sx={{ mx: 2 }}
        />
        <VolumeUp />
      </Box>
    </Box>
  );
};

export default AudioPlayer; 