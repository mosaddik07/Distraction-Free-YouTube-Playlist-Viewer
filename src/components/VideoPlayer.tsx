import React, { useEffect, useState, useCallback, useRef } from 'react';
import YouTube from 'react-youtube';
import { Play, Maximize2, Minimize2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

interface VideoPlayerProps {
  videoId: string;
  embedAllowed: boolean;
  playlistId: string;
  currentIndex: number;
  totalVideos: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  embedAllowed,
  playlistId,
  currentIndex,
  totalVideos,
}) => {
  const { state, dispatch } = useApp();
  const [isPaused, setIsPaused] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isResuming, setIsResuming] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayPending, setIsPlayPending] = useState(false);
  const playTimeoutRef = useRef<NodeJS.Timeout>();
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const handleStateChange = (event: any) => {
    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (event.data === 2) {
      setIsPaused(true);
    } else if (event.data === 1) {
      setIsPaused(false);
      setIsResuming(false);
      setIsPlayPending(false);
    }
    
    if (!player && event.target) {
      setPlayer(event.target);
    }
  };

  const handlePlayClick = useCallback(() => {
    if (!player || isPlayPending) return;

    setIsPlayPending(true);
    setIsResuming(true);

    // Clear any existing timeout
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
    }

    // Set new timeout for play action
    playTimeoutRef.current = setTimeout(() => {
      player.playVideo();
      setIsResuming(false);
      setIsPlayPending(false);
    }, 1000);
  }, [player, isPlayPending]);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Update progress whenever the current video changes
    if (currentIndex >= 0 && totalVideos > 0) {
      dispatch({
        type: 'UPDATE_PLAYLIST_PROGRESS',
        payload: {
          playlistId,
          progress: {
            currentVideoIndex: currentIndex,
            totalVideos: totalVideos,
            lastWatched: new Date().toISOString(),
          },
        },
      });
    }
  }, [currentIndex, totalVideos, playlistId, dispatch]);

  useEffect(() => {
    // Handle escape key for exiting fullscreen
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

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
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={playerContainerRef}
      className={`transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-black flex items-center justify-center p-4'
          : 'space-y-4'
      }`}
    >
      <div className={`relative ${
        isFullscreen 
          ? 'w-full h-full max-h-screen'
          : 'aspect-video w-full max-w-4xl rounded-lg overflow-hidden shadow-lg bg-gray-800'
      }`}>
        <YouTube
          videoId={videoId}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              controls: 1,
              fs: 0, // Disable native fullscreen
              origin: window.location.origin,
            },
          }}
          className="w-full h-full"
          onStateChange={handleStateChange}
          onError={(e) => {
            console.error('YouTube Player Error:', e);
            toast.error('Failed to load video');
          }}
        />

        {/* Pause/Resume Overlay */}
        {(isPaused || isResuming) && (
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-50"
            onClick={handlePlayClick}
          >
            <div className="text-center space-y-6">
              <div className="bg-white/10 rounded-full p-6 backdrop-blur-md hover:bg-white/20 transition-all duration-300 group">
                <Play 
                  size={48} 
                  className={`text-white group-hover:scale-110 transition-transform duration-300 ${
                    isResuming ? 'animate-pulse' : ''
                  }`}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-white">
                  {isResuming ? 'Resuming...' : 'Video Paused'}
                </h3>
                <p className="text-gray-300 max-w-md mx-auto px-4">
                  {isResuming ? 'Getting ready to play' : 'Click anywhere to resume playback'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div 
            className="h-full bg-blue-500"
            style={{ width: `${((currentIndex + 1) / totalVideos) * 100}%` }}
          />
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-4 right-4 p-2 rounded-lg bg-gray-800/80 text-white hover:bg-gray-700/80 transition-colors"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      {/* Progress Information - Only show when not in fullscreen */}
      {!isFullscreen && (
        <div className="bg-gray-800/30 rounded-lg p-4">
          <div className="flex justify-between items-center text-gray-300">
            <span>
              Video {currentIndex + 1} of {totalVideos}
            </span>
            <span>
              {Math.round(((currentIndex + 1) / totalVideos) * 100)}% Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};