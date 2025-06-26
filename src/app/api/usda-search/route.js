// src/app/api/usda-search/route.js
import { NextResponse } from 'next/server';
import { searchCache } from '@/utils/api-cache';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { query, pageSize = 20 } = body;
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `${query}-${pageSize}`;
    const cachedResult = searchCache.get(cacheKey);
    
    if (cachedResult) {
      console.log('Returning cached USDA search result for:', query);
      return NextResponse.json(cachedResult);
    }
    
    // Get API key from environment variable
    const apiKey = process.env.USDA_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'USDA API key is not configured' }, { status: 500 });
    }
    
    // Make request to USDA API
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query)}&pageSize=${pageSize}`;
    
    console.log('Making USDA API request for:', query);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('USDA API error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch data from USDA API' }, { status: response.status });
    }
    
    const data = await response.json();
    
    // Cache the result
    searchCache.set(cacheKey, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in USDA search API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}