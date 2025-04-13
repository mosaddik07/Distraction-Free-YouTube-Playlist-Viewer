export const extractPlaylistId = (url: string): string | null => {
  const regex = /[?&]list=([^#\&\?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const fetchPlaylistData = async (playlistId: string, apiKey: string): Promise<any> => {
  const playlistResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
  );
  const playlistData = await playlistResponse.json();

  if (!playlistData.items?.length) {
    throw new Error('Playlist not found');
  }

  const playlist = playlistData.items[0];
  const videos = await fetchAllPlaylistItems(playlistId, apiKey);

  return {
    id: playlistId,
    title: playlist.snippet.title,
    description: playlist.snippet.description,
    thumbnail: playlist.snippet.thumbnails.high.url,
    videos,
  };
};

async function fetchAllPlaylistItems(playlistId: string, apiKey: string) {
  let allVideos = [];
  let nextPageToken = '';

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}${
      nextPageToken ? `&pageToken=${nextPageToken}` : ''
    }`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) break;

    // Fetch video details to get embedding status
    const videoIds = data.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoIds}&key=${apiKey}`
    );
    const videoDetails = await videoDetailsResponse.json();

    const videosWithEmbedStatus = data.items.map((item: any) => {
      const videoDetail = videoDetails.items.find(
        (v: any) => v.id === item.snippet.resourceId.videoId
      );
      return {
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        description: item.snippet.description,
        embedAllowed: videoDetail?.status?.embeddable ?? false,
      };
    });

    allVideos = [...allVideos, ...videosWithEmbedStatus];
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return allVideos;
}