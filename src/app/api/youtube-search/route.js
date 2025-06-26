export async function GET(request) {
  try {
    // Get the search query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return Response.json({ error: 'Missing search query' }, { status: 400 });
    }
    
    // Get the YouTube API key from environment variables
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.error('YouTube API key not configured');
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }
    
    // Call the YouTube Data API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('YouTube API Error:', errorText);
      return Response.json({ error: `API request failed: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract the video ID and details from the response
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      const title = data.items[0].snippet.title;
      const thumbnail = data.items[0].snippet.thumbnails.default.url;
      
      return Response.json({
        videoId,
        title,
        thumbnail,
        url: `https://www.youtube.com/watch?v=${videoId}`
      });
    } else {
      return Response.json({ error: 'No videos found' }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}