import { useState, useEffect, useCallback, useRef } from 'react';
import { Track } from '../types';

interface AudioPlayerState {
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
}

interface UseAudioPlayerReturn extends AudioPlayerState {
  playPauseTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (value: number) => void;
  seekTo: (time: number) => void;
  currentTrack: Track | undefined;
}

const useAudioPlayer = (tracks: Track[]): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [state, setState] = useState<AudioPlayerState>({
    currentTrackIndex: 0,
    isPlaying: false,
    volume: 100,
    duration: 0,
    currentTime: 0,
  });

  const loadTrack = useCallback((index: number) => {
    const track = tracks[index];
    if (!track) return;

    audioRef.current.src = track.path;
    audioRef.current.load();
    setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
  }, [tracks]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleDurationChange = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      if (state.currentTrackIndex < tracks.length - 1) {
        setState(prev => ({ ...prev, currentTrackIndex: prev.currentTrackIndex + 1 }));
      } else {
        setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [tracks.length, state.currentTrackIndex]);

  useEffect(() => {
    if (tracks.length > 0) {
      loadTrack(state.currentTrackIndex);
    }
  }, [tracks, state.currentTrackIndex, loadTrack]);

  const playPauseTrack = useCallback(() => {
    if (state.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [state.isPlaying]);

  const nextTrack = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentTrackIndex: (prev.currentTrackIndex + 1) % tracks.length,
    }));
  }, [tracks.length]);

  const prevTrack = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentTrackIndex: (prev.currentTrackIndex - 1 + tracks.length) % tracks.length,
    }));
  }, [tracks.length]);

  const setVolume = useCallback((value: number) => {
    audioRef.current.volume = value / 100;
    setState(prev => ({ ...prev, volume: value }));
  }, []);

  const seekTo = useCallback((time: number) => {
    audioRef.current.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  return {
    ...state,
    playPauseTrack,
    nextTrack,
    prevTrack,
    setVolume,
    seekTo,
    currentTrack: tracks[state.currentTrackIndex],
  };
};

export default useAudioPlayer; 