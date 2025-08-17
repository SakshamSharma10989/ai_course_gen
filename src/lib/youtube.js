const API_KEY = process.env.YOUTUBE_API_KEY;

export async function fetchYouTubeVideos(topic) {
  if (!API_KEY) {
    throw new Error('YouTube API key is missing. Check your .env file.');
  }

  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    throw new Error('Invalid search topic');
  }

  // Append "programming" to ambiguous topics for better relevance
  const ambiguousTopics = ['string', 'array', 'class', 'object', 'function'];
  const searchQuery = ambiguousTopics.includes(topic.trim().toLowerCase())
    ? `${topic.trim()} programming`
    : topic.trim();

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&key=${API_KEY}&type=video&maxResults=4&relevanceLanguage=en`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('API access disabled. Check your Google Cloud billing account.');
      }
      if (response.status === 429) {
        throw new Error('YouTube API quota exceeded. Try again tomorrow.');
      }
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.items.map((item) => ({
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      videoTitle: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
  } catch (error) {
    throw error;
  }
}