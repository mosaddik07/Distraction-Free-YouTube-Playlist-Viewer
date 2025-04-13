import React from 'react';
import { useApp } from '../context/AppContext';
import { Playlist } from '../types';
import { Heart, Trash2, History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

  const handleToggleFavorite = (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FAVORITE', payload: playlist.id });
  };

  const renderPlaylistCard = (playlist: Playlist) => {
    const isFavorite = state.favoritePlaylists.includes(playlist.id);
    const progress = playlist.progress;
    const progressPercentage = progress 
      ? Math.round(((progress.currentVideoIndex + 1) / progress.totalVideos) * 100)
      : 0;

    return (
      <button
        key={playlist.id}
        onClick={() => handlePlaylistSelect(playlist.id)}
        className={`relative group text-left p-4 rounded-lg transition-all ${
          state.activePlaylistId === playlist.id
            ? 'bg-gray-800 border-gray-700'
            : 'bg-gray-800/50 hover:bg-gray-800'
        } border border-gray-700 shadow-lg`}
      >
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={(e) => handleToggleFavorite(playlist, e)}
            className={`p-2 transition-colors ${
              isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => handlePlaylistRemove(playlist, e)}
            className="p-2 text-gray-500 hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>

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
        
        <div className="mt-2 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">{playlist.videos.length} videos</span>
            <span className="text-blue-400 font-medium">
              {progressPercentage}% watched
            </span>
          </div>
          
          {progress && (
            <div className="space-y-1">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>
                  Video {progress.currentVideoIndex + 1} of {progress.totalVideos}
                </span>
              </div>
            </div>
          )}

          {playlist.lastAccessed && (
            <p className="flex items-center text-xs text-gray-400">
              <History size={12} className="mr-1" />
              {formatDistanceToNow(new Date(playlist.lastAccessed), { addSuffix: true })}
            </p>
          )}
        </div>
      </button>
    );
  };

  if (!state.playlists.length) {
    return null;
  }

  const sortedPlaylists = [...state.playlists].sort((a, b) => {
    const aFav = state.favoritePlaylists.includes(a.id);
    const bFav = state.favoritePlaylists.includes(b.id);
    if (aFav !== bFav) return bFav ? 1 : -1;
    
    const aRecent = state.recentPlaylists.indexOf(a.id);
    const bRecent = state.recentPlaylists.indexOf(b.id);
    if (aRecent !== bRecent) {
      if (aRecent === -1) return 1;
      if (bRecent === -1) return -1;
      return aRecent - bRecent;
    }
    
    return 0;
  });

  const favorites = sortedPlaylists.filter(p => state.favoritePlaylists.includes(p.id));
  const recent = sortedPlaylists.filter(p => 
    state.recentPlaylists.includes(p.id) && !state.favoritePlaylists.includes(p.id)
  );
  const others = sortedPlaylists.filter(p => 
    !state.recentPlaylists.includes(p.id) && !state.favoritePlaylists.includes(p.id)
  );

  return (
    <div className="w-full max-w-4xl space-y-8">
      {favorites.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <Heart size={20} className="mr-2 text-red-500" /> Favorites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favorites.map(renderPlaylistCard)}
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <History size={20} className="mr-2" /> Recently Watched
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recent.map(renderPlaylistCard)}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">All Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {others.map(renderPlaylistCard)}
          </div>
        </div>
      )}
    </div>
  );
};