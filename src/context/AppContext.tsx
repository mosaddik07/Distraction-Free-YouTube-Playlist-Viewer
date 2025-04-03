import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Playlist, AppConfig } from '../types';

type Action =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'ADD_PLAYLIST'; payload: Playlist }
  | { type: 'REMOVE_PLAYLIST'; payload: string }
  | { type: 'SET_ACTIVE_PLAYLIST'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  playlists: [],
  activePlaylistId: null,
  config: {
    youtubeApiKey: null,
  },
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_API_KEY':
      return {
        ...state,
        config: {
          ...state.config,
          youtubeApiKey: action.payload,
        },
      };
    case 'ADD_PLAYLIST':
      return {
        ...state,
        playlists: [...state.playlists, action.payload],
        activePlaylistId: state.activePlaylistId || action.payload.id,
      };
    case 'REMOVE_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.filter((p) => p.id !== action.payload),
        activePlaylistId:
          state.activePlaylistId === action.payload
            ? state.playlists.length > 1
              ? state.playlists[0].id
              : null
            : state.activePlaylistId,
      };
    case 'SET_ACTIVE_PLAYLIST':
      return {
        ...state,
        activePlaylistId: action.payload,
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}