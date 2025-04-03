import React, { useState } from "react";
import { PlaylistInput } from "./components/PlaylistInput";
import { VideoPlayer } from "./components/VideoPlayer";
import { PlaylistView } from "./components/PlaylistView";
import { ApiKeyInput } from "./components/ApiKeyInput";
import { PlaylistSelector } from "./components/PlaylistSelector";
import { Video } from "./types";
import { extractPlaylistId, fetchPlaylistData } from "./utils/youtube";
import { Loader2 } from "lucide-react";
import { useApp } from "./context/AppContext";
import Footer from "./components/Footer";

function App() {
  const { state, dispatch } = useApp();
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePlaylist = state.playlists.find(
    (p) => p.id === state.activePlaylistId
  );

  const handlePlaylistSubmit = async (url: string) => {
    if (!state.config.youtubeApiKey) {
      setError("Please configure your YouTube API key first");
      return;
    }

    setLoading(true);
    setError(null);

    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      setError("Invalid playlist URL");
      setLoading(false);
      return;
    }

    try {
      const data = await fetchPlaylistData(
        playlistId,
        state.config.youtubeApiKey
      );
      dispatch({ type: "ADD_PLAYLIST", payload: data });
      setCurrentVideo(data.videos[0]);
    } catch (err) {
      setError("Failed to load playlist");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video: Video) => {
    if (!video.embedAllowed) {
      window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank");
    } else {
      setCurrentVideo(video);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-3xl font-bold text-white">
            Distraction-Free YouTube Playlist Viewer
          </h1>

          <div className="w-full max-w-4xl space-y-4">
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
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <VideoPlayer
                  videoId={(currentVideo || activePlaylist.videos[0]).id}
                  embedAllowed={
                    (currentVideo || activePlaylist.videos[0]).embedAllowed
                  }
                />
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
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
