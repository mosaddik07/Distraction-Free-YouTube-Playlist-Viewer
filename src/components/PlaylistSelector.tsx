import React from 'react';
import { useApp } from '../context/AppContext';
import { Playlist } from '../types';
import { Trash2 } from 'lucide-react';

export const PlaylistSelector: React.FC = () => {
  const { state, dispatch } = useApp();

  const handlePlaylistSelect = (playlistId: string) => {
    dispatch({ type: 'SET_ACTIVE_PLAYLIST', payload: playlistId });
  };

  const handlePlaylistRemove = (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove "${playlist.title}"?`)) {
      dispatch({ type: 'REMOVE_PLAYLIST', payload: playlist.id });
    }
  };

  if (!state.playlists.length) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {state.playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => handlePlaylistSelect(playlist.id)}
            className={`relative group text-left p-4 rounded-lg transition-all ${
              state.activePlaylistId === playlist.id
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-800/50 hover:bg-gray-800'
            } border border-gray-700 shadow-lg`}
          >
            {playlist.thumbnail && (
              <div className="aspect-video w-full mb-2 rounded-md overflow-hidden">
                <img
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="font-medium line-clamp-2 text-white">{playlist.title}</h3>
            <p className="text-sm text-gray-400 mt-1">
              {playlist.videos.length} videos
            </p>
            <button
              onClick={(e) => handlePlaylistRemove(playlist, e)}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
};