// src/app/api/user/profile/route.js
import { NextResponse } from 'next/server';
import userModel from '@/models/user-model';
import { userDataCache } from '@/utils/api-cache';
import { getCurrentUserId } from '@/utils/auth-utils';

// Get the authenticated user's profile
export async function GET() {
  try {
    // Get user ID from session token
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get from cache first
    const cacheKey = `user-profile-${userId}`;
    const cachedProfile = userDataCache.get(cacheKey);
    
    if (cachedProfile) {
      return NextResponse.json(cachedProfile);
    }
    
    // Get user from database
    const user = await userModel.getUser(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Remove sensitive information
    const { password, ...profile } = user;
    
    // Cache the result
    userDataCache.set(cacheKey, profile);
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error in user profile API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update the authenticated user's profile
export async function PUT(request) {
  try {
    // Get user ID from session token
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const updates = await request.json();
    
    // Don't allow updating email or password through this endpoint
    if (updates.email || updates.password) {
      return NextResponse.json({ 
        error: 'Email and password cannot be updated through this endpoint' 
      }, { status: 400 });
    }
    
    // Update user in database
    try {
      const updatedUser = await userModel.updateUser(userId, updates);
      
      // Remove sensitive information
      const { password, ...profile } = updatedUser;
      
      // Clear cache
      userDataCache.delete(`user-profile-${userId}`);
      
      return NextResponse.json(profile);
    } catch (error) {
      if (error.message === 'User not found') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in user profile API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}