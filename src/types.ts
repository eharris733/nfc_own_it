export interface Track {
  _id: string;
  name: string;
  artist: string;
  path: string;
  image?: string;
  code?: string;
}

export interface Artist {
  name: string;
  bio: string;
  image: string;
  social_links: {
    [key: string]: string;
  };
}

export interface Album {
  name: string;
  artist_id: string;
  release_date: string;
  genre: string;
  cover_image: string;
  description: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
} 