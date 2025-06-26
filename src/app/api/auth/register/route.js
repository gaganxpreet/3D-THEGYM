// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import userModel from '@/models/user-model';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, password, name } = body;
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }
    
    try {
      // Create user
      const user = await userModel.createUser({ email, password, name });
      
      return NextResponse.json({
        message: 'User registered successfully',
        user
      });
    } catch (error) {
      if (error.message === 'User already exists') {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in register API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}