import React, { useState, useEffect } from 'react';
import { PlaylistInput } from './components/PlaylistInput';
import { VideoPlayer } from './components/VideoPlayer';
import { PlaylistView } from './components/PlaylistView';
import { ApiKeyInput } from './components/ApiKeyInput';
import { PlaylistSelector } from './components/PlaylistSelector';
import { Footer } from './components/Footer';
import { Video } from './types';
import { extractPlaylistId, fetchPlaylistData } from './utils/youtube';
import { Loader2 } from 'lucide-react';
import { useApp } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

function App() {
  const { state, dispatch } = useApp();
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePlaylist = state.playlists.find(
    (p) => p.id === state.activePlaylistId
  );

  useEffect(() => {
    if (activePlaylist?.progress && !currentVideo) {
      const lastWatchedVideo = activePlaylist.videos[activePlaylist.progress.currentVideoIndex];
      if (lastWatchedVideo) {
        setCurrentVideo(lastWatchedVideo);
        toast.success('Resuming from where you left off');
      }
    }
  }, [activePlaylist, currentVideo]);

  // Update document title when video changes
  useEffect(() => {
    if (currentVideo) {
      document.title = `${currentVideo.title} - YouTube Playlist Viewer`;
    } else if (activePlaylist) {
      document.title = `${activePlaylist.title} - YouTube Playlist Viewer`;
    } else {
      document.title = 'YouTube Playlist Viewer';
    }

    return () => {
      document.title = 'YouTube Playlist Viewer';
    };
  }, [currentVideo, activePlaylist]);

  const handlePlaylistSubmit = async (url: string) => {
    if (!state.config.youtubeApiKey) {
      setError('Please configure your YouTube API key first');
      return;
    }

    setLoading(true);
    setError(null);

    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      setError('Invalid playlist URL');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchPlaylistData(playlistId, state.config.youtubeApiKey);
      dispatch({ type: 'ADD_PLAYLIST', payload: data });
      setCurrentVideo(data.videos[0]);
      toast.success('Playlist loaded successfully!');
    } catch (err) {
      setError('Failed to load playlist');
      toast.error('Failed to load playlist. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video: Video) => {
    if (!video.embedAllowed) {
      window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
      toast('Opening video in YouTube', {
        icon: '↗️',
      });
    } else {
      setCurrentVideo(video);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center space-y-8">
            <h1 className="text-4xl font-bold text-white text-center bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Distraction-Free YouTube Playlist Viewer
            </h1>

            <div className="w-full max-w-4xl space-y-6 bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm">
              <ApiKeyInput />
              <PlaylistInput onSubmit={handlePlaylistSubmit} />
            </div>

            {loading && (
              <div className="flex items-center space-x-2 text-gray-300">
                <Loader2 className="animate-spin" />
                <span>Loading playlist...</span>
              </div>
            )}

            {error && (
              <div className="text-red-400 bg-red-900/50 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <PlaylistSelector />

            {activePlaylist && (currentVideo || activePlaylist.videos[0]) && (
              <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <VideoPlayer
                    videoId={(currentVideo || activePlaylist.videos[0]).id}
                    embedAllowed={(currentVideo || activePlaylist.videos[0]).embedAllowed}
                    playlistId={activePlaylist.id}
                    currentIndex={activePlaylist.videos.findIndex(
                      (v) => v.id === (currentVideo || activePlaylist.videos[0]).id
                    )}
                    totalVideos={activePlaylist.videos.length}
                  />
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {(currentVideo || activePlaylist.videos[0]).title}
                    </h2>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <PlaylistView
                    videos={activePlaylist.videos}
                    onVideoSelect={handleVideoSelect}
                    currentVideoId={(currentVideo || activePlaylist.videos[0]).id}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#333',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#333',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
