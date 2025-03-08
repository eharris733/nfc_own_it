import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Track } from '../types';

interface UseAudioPlayerReturn {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  togglePlay: () => void;
  handleVolumeChange: (event: Event, newValue: number | number[]) => void;
  handleProgressChange: (event: Event, newValue: number | number[]) => void;
  playPreviousTrack: () => void;
  playNextTrack: () => void;
}

const useAudioPlayer = (tracks: Track[]): UseAudioPlayerReturn => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || tracks.length === 0) return;

    const audio = audioRef.current;
    audio.src = tracks[currentTrackIndex].path;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNextTrack();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      progressIntervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    if (!audioRef.current) return;
    
    const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = clampedVolume;
    setVolume(clampedVolume);
  };

  const handleProgressChange = (event: Event, newValue: number | number[]) => {
    if (!audioRef.current) return;
    
    const newProgress = Array.isArray(newValue) ? newValue[0] : newValue;
    const clampedProgress = Math.max(0, Math.min(duration, newProgress));
    audioRef.current.currentTime = clampedProgress;
    setProgress(clampedProgress);
  };

  const playPreviousTrack = () => {
    if (tracks.length === 0) return;
    const newIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(newIndex);
  };

  const playNextTrack = () => {
    if (tracks.length === 0) return;
    const newIndex = currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1;
    setCurrentTrackIndex(newIndex);
  };

  return {
    currentTrack: tracks.length > 0 ? tracks[currentTrackIndex] : null,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    handleVolumeChange,
    handleProgressChange,
    playPreviousTrack,
    playNextTrack,
  };
};

export default useAudioPlayer; 