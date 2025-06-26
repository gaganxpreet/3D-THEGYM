// src/app/api/generate-pdf/route.js
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    if (!body.workoutData) {
      return Response.json({ error: 'Missing workout data in request body' }, { status: 400 });
    }
    
    // Return the workout data to be processed on the client side
    // We'll generate the PDF on the client side using jsPDF
    return Response.json({ success: true, workoutData: body.workoutData });
  } catch (error) {
    console.error('Error in generate-pdf API route:', error);
    return Response.json({ error: 'Failed to process workout data' }, { status: 500 });
  }
}