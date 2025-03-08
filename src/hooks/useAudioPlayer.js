import { useState, useEffect, useCallback } from 'react';

const useAudioPlayer = (tracks) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());

  const loadTrack = useCallback((index) => {
    const track = tracks[index];
    audio.src = track.path;
    audio.load();
    setIsPlaying(false);
  }, [audio, tracks]);

  useEffect(() => {
    if (tracks.length > 0) {
      loadTrack(currentTrackIndex);
    }
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [tracks, currentTrackIndex, loadTrack, audio]);

  const playPauseTrack = useCallback(() => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, audio]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  }, [tracks.length]);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const setVolume = useCallback((value) => {
    audio.volume = value / 100;
  }, [audio]);

  return {
    currentTrackIndex,
    isPlaying,
    playPauseTrack,
    nextTrack,
    prevTrack,
    setVolume,
    currentTrack: tracks[currentTrackIndex],
  };
};

export default useAudioPlayer; 