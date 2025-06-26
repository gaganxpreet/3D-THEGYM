// src/app/api/youtube-batch-search/route.js
import { youtubeCache } from '@/utils/api-cache';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { queries } = body;
    
    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      return Response.json({ error: 'Missing or invalid queries array' }, { status: 400 });
    }
    
    // Get the YouTube API key from environment variables
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.error('YouTube API key not configured');
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }
    
    // Create a function to fetch a single video
    const fetchVideo = async (query) => {
      try {
        // Check cache first
        const cacheKey = `youtube_search_${query}`;
        const cachedResult = youtubeCache.get(cacheKey);
        
        if (cachedResult) {
          console.log(`Using cached result for "${query}"`);
          return { query, ...cachedResult };
        }
        
        const searchQuery = `${query} exercise tutorial`;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(searchQuery)}&type=video&key=${apiKey}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`YouTube API Error for ${query}:`, errorText);
          return { query, error: `API request failed: ${response.status}` };
        }

        const data = await response.json();
        
        // Extract the video ID and details from the response
        if (data.items && data.items.length > 0) {
          const videoId = data.items[0].id.videoId;
          const title = data.items[0].snippet.title;
          const thumbnail = data.items[0].snippet.thumbnails.default.url;
          
          const result = {
            videoId,
            title,
            thumbnail,
            url: `https://www.youtube.com/watch?v=${videoId}`
          };
          
          // Store in cache
          youtubeCache.set(cacheKey, result);
          
          return { query, ...result };
        } else {
          return { query, error: 'No videos found' };
        }
      } catch (error) {
        console.error(`Error fetching video for ${query}:`, error);
        return { query, error: 'Internal server error' };
      }
    };
    
    // Process all queries in parallel
    const results = await Promise.all(queries.map(fetchVideo));
    
    // Return the results
    return Response.json({ results });
    
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add other HTTP methods if needed
export async function GET() {
  return Response.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}