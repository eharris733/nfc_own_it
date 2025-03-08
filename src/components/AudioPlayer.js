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

const AudioPlayer = ({ tracks }) => {
  const {
    currentTrackIndex,
    isPlaying,
    playPauseTrack,
    nextTrack,
    prevTrack,
    setVolume,
    currentTrack,
  } = useAudioPlayer(tracks);

  if (!currentTrack) return null;

  return (
    <Box sx={{ textAlign: 'center' }}>
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
          margin: 2,
        }}
      />
      <Typography variant="h3">{currentTrack.name}</Typography>
      <Typography variant="h5">{currentTrack.artist}</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2, justifyContent: 'center' }}>
        <IconButton onClick={prevTrack}>
          <SkipPrevious fontSize="large" />
        </IconButton>
        <IconButton onClick={playPauseTrack}>
          {isPlaying ? (
            <PauseCircle fontSize="large" />
          ) : (
            <PlayCircle fontSize="large" />
          )}
        </IconButton>
        <IconButton onClick={nextTrack}>
          <SkipNext fontSize="large" />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '50%',
          marginTop: 2,
          marginX: 'auto',
        }}
      >
        <VolumeDown />
        <Slider
          defaultValue={100}
          min={0}
          max={100}
          onChange={(e, value) => setVolume(value)}
        />
        <VolumeUp />
      </Box>
    </Box>
  );
};

export default AudioPlayer; 