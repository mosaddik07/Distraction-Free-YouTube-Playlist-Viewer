import React from 'react';
import YouTube from 'react-youtube';
import { ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  embedAllowed: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, embedAllowed }) => {
  if (!embedAllowed) {
    return (
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-video flex items-center justify-center bg-gray-900">
          <div className="text-center p-8">
            <p className="text-gray-300 mb-4">
              This video cannot be embedded due to restrictions set by the content owner.
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <span>Watch on YouTube</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full max-w-4xl rounded-lg overflow-hidden shadow-lg bg-gray-800">
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin,
          },
        }}
        className="w-full h-full"
        onError={(e) => {
          console.error('YouTube Player Error:', e);
        }}
      />
    </div>
  );
};