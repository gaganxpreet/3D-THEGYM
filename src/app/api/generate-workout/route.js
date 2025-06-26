// src/app/api/generate-workout/route.js
export async function POST(request) {
  try {
    // Log the incoming request for debugging
    console.log('Received request for workout generation')
    
    // Parse the request body
    const body = await request.json()
    
    if (!body.prompt) {
      console.error('Missing prompt in request body')
      return Response.json({ error: 'Missing prompt in request body' }, { status: 400 })
    }
    
    const prompt = body.prompt
    console.log('Processing prompt:', prompt.substring(0, 100) + '...')
    
    // Use the secure API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      console.error('Gemini API key not configured')
      return Response.json({ error: 'API key not configured' }, { status: 500 })
    }

    console.log('Calling Gemini API...')
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API Error:', errorText)
      return Response.json({ error: `API request failed: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log('Successfully received response from Gemini API')
    
    // Try to parse the workout data from the response
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      let workoutData
      
      // First attempt: Try to parse the entire response as JSON
      try {
        workoutData = JSON.parse(text.trim())
      } catch (directParseError) {
        // Second attempt: Try to extract JSON from markdown code blocks if present
        const jsonMatch = text.match(/```json\n([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/)
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text
        workoutData = JSON.parse(jsonString.trim())
      }
      
      // Add YouTube video links to each exercise
      const youtubeApiKey = process.env.YOUTUBE_API_KEY
      
      if (!youtubeApiKey) {
        console.error('YouTube API key not configured')
        // Continue without YouTube videos if API key is missing
      }
      
      // Function to fetch YouTube videos in batch
      const getYouTubeVideos = async (exerciseNames) => {
        // Skip YouTube API call if API key is not available
        if (!youtubeApiKey) {
          return {}
        }
        
        try {
          // Filter out any empty exercise names
          const validExercises = exerciseNames.filter(name => name && name.trim() !== '')
          
          if (validExercises.length === 0) {
            return {}
          }
          
          // Call the batch search endpoint with absolute URL
          const host = request.headers.get('host') || 'localhost:3000'
          const protocol = host.includes('localhost') ? 'http' : 'https'
          const response = await fetch(`${protocol}://${host}/api/youtube-batch-search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              queries: validExercises
            })
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error('YouTube Batch API Error:', errorText)
            return {}
          }
          
          const data = await response.json()
          
          // Create a map of exercise name to video data
          const videoMap = {}
          if (data.results && Array.isArray(data.results)) {
            data.results.forEach(result => {
              if (result.videoId) {
                videoMap[result.query] = {
                  videoId: result.videoId,
                  url: result.url,
                  title: result.title,
                  thumbnail: result.thumbnail
                }
              }
            })
          }
          
          return videoMap
        } catch (error) {
          console.error('Error fetching YouTube videos in batch:', error)
          return {}
        }
      }
      
      // Collect all exercise names from the workout
      const allExerciseNames = []
      
      // Add main workout exercises
      if (workoutData.mainWorkout && Array.isArray(workoutData.mainWorkout)) {
        workoutData.mainWorkout.forEach(exercise => {
          if (exercise.exercise) {
            allExerciseNames.push(exercise.exercise)
          }
        })
      }
      
      // Add warmup exercises
      if (workoutData.warmup && Array.isArray(workoutData.warmup)) {
        workoutData.warmup.forEach(exercise => {
          if (exercise.exercise) {
            allExerciseNames.push(exercise.exercise)
          }
        })
      }
      
      // Add cooldown exercises
      if (workoutData.cooldown && Array.isArray(workoutData.cooldown)) {
        workoutData.cooldown.forEach(exercise => {
          if (exercise.exercise) {
            allExerciseNames.push(exercise.exercise)
          }
        })
      }
      
      // Fetch all YouTube videos in a single batch request
      console.log(`Fetching videos for ${allExerciseNames.length} exercises in batch`)
      const videoMap = await getYouTubeVideos(allExerciseNames)
      
      // Add videos to main workout exercises
      if (workoutData.mainWorkout && Array.isArray(workoutData.mainWorkout)) {
        workoutData.mainWorkout = workoutData.mainWorkout.map(exercise => {
          if (exercise.exercise && videoMap[exercise.exercise]) {
            exercise.youtubeVideo = videoMap[exercise.exercise]
          }
          return exercise
        })
      }
      
      // Add videos to warmup exercises
      if (workoutData.warmup && Array.isArray(workoutData.warmup)) {
        workoutData.warmup = workoutData.warmup.map(exercise => {
          if (exercise.exercise && videoMap[exercise.exercise]) {
            exercise.youtubeVideo = videoMap[exercise.exercise]
          }
          return exercise
        })
      }
      
      // Add videos to cooldown exercises
      if (workoutData.cooldown && Array.isArray(workoutData.cooldown)) {
        workoutData.cooldown = workoutData.cooldown.map(exercise => {
          if (exercise.exercise && videoMap[exercise.exercise]) {
            exercise.youtubeVideo = videoMap[exercise.exercise]
          }
          return exercise
        })
      }
      
      // Return the enhanced workout data
      return Response.json({ ...data, enhancedWorkout: workoutData })
    } catch (parseError) {
      console.error('Error parsing or enhancing workout data:', parseError)
      // Return the original response if parsing fails
      return Response.json(data)
    }
    
  } catch (error) {
    console.error('Server error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Add other HTTP methods if needed
export async function GET() {
  return Response.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 })
}
  