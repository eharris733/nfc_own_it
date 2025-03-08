export interface Track {
  id?: string;
  name: string;
  artist: string;
  image: string;
  path: string;
  albumId?: string;
  artistId?: string;
  type?: string;
  lyrics?: string;
  duration?: number;
  trackNumber?: number;
  metadata?: {
    bitrate: string;
    format: string;
    resolution: string;
  };
}

export interface Artist {
  id?: string;
  name: string;
  bio: string;
  image: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
}

export interface Album {
  id?: string;
  artistId: string;
  name: string;
  releaseDate: string;
  genre: string;
  coverImage: string;
  description: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadFormData {
  name: string;
  artist: string;
  trackFile: File | null;
  imageFile: File | null;
}

export interface FileUploadButtonProps {
  id: string;
  name: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  variant: 'contained' | 'outlined' | 'text';
  required?: boolean;
  file: File | null;
} 