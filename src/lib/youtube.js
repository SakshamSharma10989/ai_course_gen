const API_KEY = process.env.YOUTUBE_API_KEY;
const MAX_REQUESTS = 100; // Allow up to 100 searches daily (~10,000 units)
let requestCount = 0; // Note: In-memory, resets on server restart

export async function fetchYouTubeVideos(topic) {
  if (!API_KEY) {
    throw new Error('YouTube API key is missing. Check your .env file.');
  }

  if (requestCount >= MAX_REQUESTS) {
    throw new Error('Daily YouTube API quota exceeded. Try again tomorrow.');
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        topic
      )}&key=${API_KEY}&type=video&maxResults=5`,
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
    requestCount++;
    console.log(`YouTube API request #${requestCount} for topic: ${topic}`);

    return data.items.map((item) => ({
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      videoTitle: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url, // Use medium for better quality
    }));
  } catch (error) {
    console.error('YouTube fetch error:', error.message);
    throw error;
  }
}