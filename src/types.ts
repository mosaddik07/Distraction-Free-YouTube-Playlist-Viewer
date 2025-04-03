export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  embedAllowed: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  videos: Video[];
  thumbnail?: string;
  description?: string;
}

export interface AppConfig {
  youtubeApiKey: string | null;
}

export interface AppState {
  playlists: Playlist[];
  activePlaylistId: string | null;
  config: AppConfig;
}