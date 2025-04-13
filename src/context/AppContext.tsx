import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Playlist, PlaylistProgress } from '../types';

type Action =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'ADD_PLAYLIST'; payload: Playlist }
  | { type: 'REMOVE_PLAYLIST'; payload: string }
  | { type: 'SET_ACTIVE_PLAYLIST'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'UPDATE_PLAYLIST_PROGRESS'; payload: { playlistId: string; progress: PlaylistProgress } }
  | { type: 'LOAD_STATE'; payload: AppState };

const STORAGE_KEY = 'youtube-playlist-viewer-state';

const initialState: AppState = {
  playlists: [],
  activePlaylistId: null,
  config: {
    youtubeApiKey: localStorage.getItem('youtubeApiKey') || null,
  },
  recentPlaylists: [],
  favoritePlaylists: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

function updateRecentPlaylists(recentPlaylists: string[], playlistId: string): string[] {
  return [playlistId, ...recentPlaylists.filter(id => id !== playlistId)].slice(0, 10);
}

function appReducer(state: AppState, action: Action): AppState {
  let newState: AppState;

  switch (action.type) {
    case 'SET_API_KEY':
      localStorage.setItem('youtubeApiKey', action.payload);
      newState = {
        ...state,
        config: {
          ...state.config,
          youtubeApiKey: action.payload,
        },
      };
      break;

    case 'ADD_PLAYLIST':
      newState = {
        ...state,
        playlists: [...state.playlists, action.payload],
        activePlaylistId: state.activePlaylistId || action.payload.id,
        recentPlaylists: updateRecentPlaylists(state.recentPlaylists, action.payload.id),
      };
      break;

    case 'REMOVE_PLAYLIST': {
      const filteredPlaylists = state.playlists.filter((p) => p.id !== action.payload);
      newState = {
        ...state,
        playlists: filteredPlaylists,
        activePlaylistId:
          state.activePlaylistId === action.payload
            ? filteredPlaylists.length > 0
              ? filteredPlaylists[0].id
              : null
            : state.activePlaylistId,
        recentPlaylists: state.recentPlaylists.filter(id => id !== action.payload),
        favoritePlaylists: state.favoritePlaylists.filter(id => id !== action.payload),
      };
      break;
    }

    case 'SET_ACTIVE_PLAYLIST':
      newState = {
        ...state,
        activePlaylistId: action.payload,
        recentPlaylists: updateRecentPlaylists(state.recentPlaylists, action.payload),
        playlists: state.playlists.map(playlist => 
          playlist.id === action.payload 
            ? { ...playlist, lastAccessed: new Date().toISOString() }
            : playlist
        ),
      };
      break;

    case 'TOGGLE_FAVORITE': {
      const isFavorite = state.favoritePlaylists.includes(action.payload);
      newState = {
        ...state,
        favoritePlaylists: isFavorite
          ? state.favoritePlaylists.filter(id => id !== action.payload)
          : [...state.favoritePlaylists, action.payload],
      };
      break;
    }

    case 'UPDATE_PLAYLIST_PROGRESS':
      newState = {
        ...state,
        playlists: state.playlists.map(playlist =>
          playlist.id === action.payload.playlistId
            ? { ...playlist, progress: action.payload.progress }
            : playlist
        ),
      };
      break;

    case 'LOAD_STATE':
      newState = {
        ...action.payload,
        config: {
          ...action.payload.config,
          youtubeApiKey: localStorage.getItem('youtubeApiKey') || action.payload.config.youtubeApiKey,
        },
      };
      break;

    default:
      return state;
  }

  // Persist state after each action
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted state on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;