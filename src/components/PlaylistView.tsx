import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Video } from '../types';

interface PlaylistViewProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
  currentVideoId: string;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  videos,
  onVideoSelect,
  currentVideoId,
}) => {
  return (
    <div className="w-full h-full">
      <h2 className="text-xl font-semibold mb-4 text-white">Playlist Videos</h2>
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => onVideoSelect(video)}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${
              video.id === currentVideoId ? 'bg-gray-800' : 'hover:bg-gray-800/50'
            }`}
          >
            <div className="relative w-40 h-24 rounded-md overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {video.id === currentVideoId && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Play className="text-white" size={24} />
                </div>
              )}
              {!video.embedAllowed && (
                <div className="absolute top-1 right-1">
                  <ExternalLink size={16} className="text-white drop-shadow-lg" />
                </div>
              )}
            </div>
            <div className="ml-4 flex-1 text-left">
              <h3 className="font-medium line-clamp-2 text-white">{video.title}</h3>
              {!video.embedAllowed && (
                <span className="text-xs text-gray-400 mt-1">
                  Opens in YouTube
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};