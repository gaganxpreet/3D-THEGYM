// src/app/api/usda-details/route.js
import { NextResponse } from 'next/server';
import { detailsCache } from '@/utils/api-cache';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { fdcId } = body;
    
    if (!fdcId) {
      return NextResponse.json({ error: 'Food ID (fdcId) is required' }, { status: 400 });
    }

    // Check cache first
    const cachedResult = detailsCache.get(fdcId);
    
    if (cachedResult) {
      console.log('Returning cached USDA food details for ID:', fdcId);
      return NextResponse.json(cachedResult);
    }
    
    // Get API key from environment variable
    const apiKey = process.env.USDA_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'USDA API key is not configured' }, { status: 500 });
    }
    
    // Make request to USDA API
    const url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`;
    
    console.log('Making USDA API request for food details, ID:', fdcId);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('USDA API error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch food details from USDA API' }, { status: response.status });
    }
    
    const data = await response.json();
    
    // Cache the result
    detailsCache.set(fdcId, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in USDA food details API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}