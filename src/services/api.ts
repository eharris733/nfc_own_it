import { Track, Artist, Album, ApiResponse } from '../types';
import { API_BASE_URL, ENDPOINTS } from '../constants/api';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async fetchTracks(): Promise<Track[]> {
    const response = await this.request<Track[]>(ENDPOINTS.TRACKS);
    return response.data || [];
  }

  static async uploadTrack(formData: FormData): Promise<ApiResponse<Track>> {
    return this.request<Track>(ENDPOINTS.UPLOAD_TRACK, {
      method: 'POST',
      body: formData,
    });
  }

  static async fetchArtists(): Promise<Artist[]> {
    const response = await this.request<Artist[]>(ENDPOINTS.ARTISTS);
    return response.data || [];
  }

  static async fetchAlbumsByArtist(artistId: string): Promise<Album[]> {
    const endpoint = ENDPOINTS.ALBUMS.replace(':artistId', artistId);
    const response = await this.request<Album[]>(endpoint);
    return response.data || [];
  }

  static async unlockContent(token: string): Promise<ApiResponse<void>> {
    return this.request<void>('/unlock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
  }
}

export default ApiService; 