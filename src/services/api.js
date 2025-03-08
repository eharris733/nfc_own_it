import { API_BASE_URL, ENDPOINTS } from '../constants/api';

class ApiService {
  static async fetchTracks() {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TRACKS}`);
      if (!response.ok) throw new Error('Failed to fetch tracks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tracks:', error);
      throw error;
    }
  }

  static async uploadTrack(formData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}${ENDPOINTS.UPLOAD_TRACK}`,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!response.ok) throw new Error('Upload failed');
      return await response.json();
    } catch (error) {
      console.error('Error uploading track:', error);
      throw error;
    }
  }

  static async fetchArtists() {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ARTISTS}`);
      if (!response.ok) throw new Error('Failed to fetch artists');
      return await response.json();
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  }

  static async fetchAlbumsByArtist(artistId) {
    try {
      const url = `${API_BASE_URL}${ENDPOINTS.ALBUMS.replace(':artistId', artistId)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch albums');
      return await response.json();
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw error;
    }
  }
}

export default ApiService; 