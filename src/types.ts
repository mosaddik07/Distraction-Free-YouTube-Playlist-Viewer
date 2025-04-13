export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  embedAllowed: boolean;
}

export interface PlaylistProgress {
  currentVideoIndex: number;
  totalVideos: number;
  lastWatched: string; // ISO date string
}

export interface Playlist {
  id: string;
  title: string;
  videos: Video[];
  thumbnail?: string;
  description?: string;
  isFavorite?: boolean;
  progress?: PlaylistProgress;
  lastAccessed?: string; // ISO date string
}

export interface AppConfig {
  youtubeApiKey: string | null;
}

export interface AppState {
  playlists: Playlist[];
  activePlaylistId: string | null;
  config: AppConfig;
  recentPlaylists: string[]; // Array of playlist IDs
  favoritePlaylists: string[]; // Array of playlist IDs
}