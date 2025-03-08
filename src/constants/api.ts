export const API_BASE_URL: string = 'http://localhost:8000';

export interface Endpoints {
  TRACKS: string;
  UPLOAD_TRACK: string;
  ARTISTS: string;
  ALBUMS: string;
}

export const ENDPOINTS: Endpoints = {
  TRACKS: '/tracks',
  UPLOAD_TRACK: '/upload/track',
  ARTISTS: '/artists',
  ALBUMS: '/artists/:artistId/albums',
};

export const DEFAULT_COVER_IMAGE: string = 'https://static.thenounproject.com/png/1813969-200.png'; 